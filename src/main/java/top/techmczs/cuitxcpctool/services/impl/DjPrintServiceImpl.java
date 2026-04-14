/*
 * Copyright (C) 2018-2026 Modding Craft ZBD Studio.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */

package top.techmczs.cuitxcpctool.services.impl;

import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import top.techmczs.cuitxcpctool.common.QueueTaskStatus;
import top.techmczs.cuitxcpctool.common.SqlQueue;
import top.techmczs.cuitxcpctool.constant.MessageConstant;
import top.techmczs.cuitxcpctool.constant.SseEventConstant;
import top.techmczs.cuitxcpctool.dto.PrintTaskDTO;
import top.techmczs.cuitxcpctool.dto.PrintTeamDTO;
import top.techmczs.cuitxcpctool.entity.PrintTask;
import top.techmczs.cuitxcpctool.entity.Team;
import top.techmczs.cuitxcpctool.exception.GetFileErrorException;
import top.techmczs.cuitxcpctool.exception.QueueTaskException;
import top.techmczs.cuitxcpctool.exception.TeamNotExistException;
import top.techmczs.cuitxcpctool.mapper.PrintTaskMapper;
import top.techmczs.cuitxcpctool.mapper.TeamMapper;
import top.techmczs.cuitxcpctool.properties.ToolProperties;
import top.techmczs.cuitxcpctool.result.Result;
import top.techmczs.cuitxcpctool.services.DjPrintService;
import top.techmczs.cuitxcpctool.services.SseManagerService;
import top.techmczs.cuitxcpctool.utils.PdfUtil;

import java.io.File;
import java.nio.file.Files;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class DjPrintServiceImpl implements DjPrintService {

    // 注入全局SSE管理器
    private final SseManagerService sseManagerService;

    private final SqlQueue<PrintTask> printTaskQueue;
    private final PrintTaskMapper printTaskMapper;
    private final TeamMapper teamMapper;
    private final ToolProperties toolProperties;

    @Override
    public void addPrintTask(MultipartFile file, PrintTeamDTO printTeamDTO) {
        try {
            //禁止线上打印
            if(toolProperties.isShouldForbiddenOnlinePrint()){
                if(teamMapper.selectById(printTeamDTO.getExamNum()).getPosition().equals(toolProperties.getOnlineLocationKey())){
                    log.info(MessageConstant.FORBIDDEN_PRINT, printTeamDTO.getExamNum());
                    return;
                }
            }
            // 入库
            PrintTask task = enqueue(file, printTeamDTO);
            log.info(MessageConstant.TEAM_NEED_PRINT,printTeamDTO.getExamNum());
            // 立即推送给前端
            pushPrintTaskToSSE(task);
        } catch (Exception e) {
            throw new QueueTaskException(MessageConstant.ADD_PRINT_TASK_FAILED);
        }
    }

    @Scheduled(fixedRate = 60000)
    public void rePushPendingPrintTask() {
        // 查询待处理任务
        List<PrintTask> pendingTasks = printTaskQueue.dequeueTasks(printTaskMapper);
        if (pendingTasks.isEmpty()) {
            sseManagerService.sendHeartbeat();
            return;
        }
        // 广播未处理任务
        List<PrintTaskDTO> dtoList = buildPrintTaskDTO(pendingTasks);
        sseManagerService.broadcast(SseEventConstant.PRINT_TASK, Result.success(dtoList));
    }

    private void pushPrintTaskToSSE(PrintTask task) {
        List<PrintTaskDTO> dtoList = buildPrintTaskDTO(Collections.singletonList(task));
        sseManagerService.broadcast(SseEventConstant.PRINT_TASK, Result.success(dtoList));
    }

    @Override
    public void setPrintTaskDone(Long taskId) {
        printTaskMapper.update(null, new UpdateWrapper<PrintTask>().lambda()
                .eq(PrintTask::getId, taskId)
                .set(PrintTask::getStatus, QueueTaskStatus.DONE));
    }

    @Override
    public byte[] getPdfFileByTaskId(Long taskId) {
        return getPdfFile(printTaskMapper.selectById(taskId).getFilePath());
    }

    @Override
    public IPage<PrintTaskDTO> queryAuthTasksByPage(int curPage) {
        Page<PrintTask> taskPage = new Page<>(curPage, 10);
        printTaskMapper.selectPage(taskPage, null);

        List<PrintTaskDTO> dtoList = taskPage.getRecords().stream().map(task -> {
            Team team = teamMapper.selectById(task.getExamNum());
            if (team == null) throw new TeamNotExistException(MessageConstant.TEAM_NOT_FOUND);
            return new PrintTaskDTO()
                    .setTaskId(task.getId())
                    .setTeamName(team.getTeamName())
                    .setTeamPosition(team.getPosition())
                    .setStatus(task.getStatus());
        }).toList();

        return new Page<PrintTaskDTO>(curPage, 10)
                .setRecords(dtoList)
                .setTotal(taskPage.getTotal()) // 总条数
                .setCurrent(taskPage.getCurrent())  // 当前页
                .setSize(taskPage.getSize()); // 每页条数
    }

    @Override
    public void clearAll() {
        printTaskQueue.clear(PrintTask.class);
    }

    private PrintTask enqueue(MultipartFile file, PrintTeamDTO printTeamDTO) {
        try{
            String filePath = PdfUtil.savePdf(file);
            PrintTask task = new PrintTask(printTeamDTO, file.getOriginalFilename(), filePath);
            printTaskQueue.enqueue(task, printTaskMapper);
            return task;
        } catch (Exception e){
            throw new QueueTaskException(MessageConstant.ADD_PRINT_TASK_FAILED);
        }
    }

    private List<PrintTaskDTO> buildPrintTaskDTO(List<PrintTask> tasks) {
        if (tasks.isEmpty()) return Collections.emptyList();

        return tasks.stream().map(task -> {
            Team team = teamMapper.selectById(task.getExamNum());
            String teamName = team == null ? MessageConstant.UNKNOWN_TEAM: team.getTeamName();
            String position = team == null ? MessageConstant.UNKNOWN_TEAM_POSITION: team.getPosition();

            return new PrintTaskDTO()
                    .setTaskId(task.getId())
                    .setTeamName(teamName)
                    .setTeamPosition(position)
                    .setStatus(task.getStatus());
        }).toList();
    }

    private byte[] getPdfFile(String filePath) {
        File localFile = PdfUtil.readPdf(filePath);
        if (!localFile.exists()) {
            throw new GetFileErrorException();
        }
        try {
            return Files.readAllBytes(localFile.toPath());
        } catch (Exception e) {
            throw new GetFileErrorException(MessageConstant.TRANSFER_PRINT_TASK_FAILED);
        }
    }
}