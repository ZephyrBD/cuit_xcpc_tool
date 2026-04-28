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

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import top.techmczs.cuitxcpctool.common.ColorMap;
import top.techmczs.cuitxcpctool.constant.MessageConstant;
import top.techmczs.cuitxcpctool.constant.SseEventConstant;
import top.techmczs.cuitxcpctool.dto.BalloonTaskDTO;
import top.techmczs.cuitxcpctool.entity.domjudge.DjBalloon;
import top.techmczs.cuitxcpctool.properties.ToolProperties;
import top.techmczs.cuitxcpctool.result.Result;
import top.techmczs.cuitxcpctool.services.DjBalloonService;
import top.techmczs.cuitxcpctool.services.DomjudgeFetchService;
import top.techmczs.cuitxcpctool.services.SseManagerService;
import top.techmczs.cuitxcpctool.utils.TimeUtil;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
@Slf4j
@RequiredArgsConstructor
public class DjBalloonServiceImpl implements DjBalloonService {

    private final SseManagerService sseManagerService;
    private final List<BalloonTaskDTO> NEW_BALLOONS = new CopyOnWriteArrayList<>();
    // 首杀缓存：key=题目ID，value=首杀气球（仅定时任务更新，分页查询只读）
    private final Map<String, DjBalloon> FIRST_SOLVE_BALLOON = new ConcurrentHashMap<>();

    private final DomjudgeFetchService domjudgeFetchService;
    private final ToolProperties toolProperties;

    // 500ms 推送气球到前端
    @Scheduled(fixedRate = 500)
    public void pushBalloonToClients() {
        try {
            List<BalloonTaskDTO> tempList;
            if (NEW_BALLOONS.isEmpty()) {
                sseManagerService.sendHeartbeat();
                return;
            }
            tempList = new ArrayList<>(NEW_BALLOONS);
            NEW_BALLOONS.clear();

            for (BalloonTaskDTO dto : tempList) {
                try {
                    sseManagerService.broadcast(SseEventConstant.BALLOON_TASK, Result.success(dto));
                    log.info(MessageConstant.PUSH_BALLOON_TASK_SUCCESS, dto.getBalloonId());
                } catch (Exception e) {
                    log.error(MessageConstant.SKIP_BALLOON_TASK);
                }
            }
        } catch (Exception e) {
            log.error(MessageConstant.SSE_BROADCAST_FAILED, e.getMessage());
        }
    }

    // 1秒 从DJ拉取气球（唯一：更新首杀缓存的入口）
    @Scheduled(fixedRate = 1000)
    public void getBalloonFromDomjudge() {
        try {
            List<DjBalloon> djBalloons = domjudgeFetchService.getSortedBalloons();
            for (var djBalloon : djBalloons) {
                //更新首杀缓存
                updateFirstSolveCache(djBalloon);
                // 只处理未完成的气球
                if (djBalloon.getDone()) continue;
                // 读取首杀状态（读）
                boolean isFirst = getFirstSolveStatus(djBalloon);
                // 转换DTO
                BalloonTaskDTO balloonTaskDTO = convertToBalloonDTO(djBalloon, isFirst);

                // 线上队伍处理
                if (toolProperties.isShouldForbiddenOnlinePrint() && balloonTaskDTO.getTeamLocation().contains(toolProperties.getOnlineLocationKey())) {
                    setBalloonDone(djBalloon.getBalloonId());
                    continue;
                }

                NEW_BALLOONS.add(balloonTaskDTO);
            }
        } catch (Exception e) {
            log.error(MessageConstant.GET_BALLOON_ERROR, e.getMessage());
        }
    }

    // 分页查询全量气球（只读缓存，不修改任何首杀数据）
    @Override
    public IPage<BalloonTaskDTO> getAllBalloonFromDomjudge(int cur) {
        List<DjBalloon> dtoList = domjudgeFetchService.getSortedBalloons();

        // 只读首杀缓存，转换DTO，返回正确首杀状态
        List<BalloonTaskDTO> balloonTaskDTOList = dtoList.stream()
                .map(dj -> convertToBalloonDTO(dj, getFirstSolveStatus(dj)))
                .toList();

        // 分页逻辑
        long pageSize = 10;
        long total = balloonTaskDTOList.size();
        long startIndex = (cur - 1) * pageSize;

        List<BalloonTaskDTO> pageRecords = startIndex >= total
                ? Collections.emptyList()
                : balloonTaskDTOList.stream().skip(startIndex).limit(pageSize).toList();

        Page<BalloonTaskDTO> page = new Page<>(cur, pageSize);
        page.setRecords(pageRecords);
        page.setTotal(total);
        return page;
    }

    /**
     * 更新首杀缓存
     */
    private void updateFirstSolveCache(@NonNull DjBalloon djBalloon) {
        String problemId = djBalloon.getContestProblem().getShortName();
        double currentTime = Double.parseDouble(djBalloon.getTime());

        FIRST_SOLVE_BALLOON.merge(problemId, djBalloon, (oldFirst, newFirst) -> {
            double oldTime = Double.parseDouble(oldFirst.getTime());
            return currentTime < oldTime ? newFirst : oldFirst;
        });
    }

    /**
     * 获取首杀状态
     */
    private boolean getFirstSolveStatus(@NonNull DjBalloon djBalloon) {
        String problemId = djBalloon.getContestProblem().getShortName();
        DjBalloon firstBalloon = FIRST_SOLVE_BALLOON.get(problemId);
        if (firstBalloon == null) return false;

        // 判断当前气球是否是首杀气球
        return djBalloon.getBalloonId().equals(firstBalloon.getBalloonId());
    }

    /**
     * 纯数据转换
     */
    private BalloonTaskDTO convertToBalloonDTO(@NonNull DjBalloon djBalloon, boolean isFirst) {
        String teamName = djBalloon.getTeam();
        if (teamName != null && teamName.contains(": ")) {
            teamName = teamName.split(": ")[1];
        }

        return new BalloonTaskDTO()
                .setBalloonId(djBalloon.getBalloonId())
                .setProblem(djBalloon.getContestProblem().getShortName())
                .setTeamName(teamName)
                .setTeamLocation(djBalloon.getLocation())
                .setColorName(ColorMap.getChineseName(djBalloon.getContestProblem().getColor()))
                .setTime(TimeUtil.timestampToLocalDateTime(Double.parseDouble(djBalloon.getTime())))
                .setIsFinished(djBalloon.getDone())
                .setIsFirst(isFirst);
    }

    // 标记气球完成
    @Override
    public void setBalloonDone(Long id) {
        domjudgeFetchService.setBalloonDone(id);
    }

    // 清空首杀缓存
    @Override
    public void clearBalloons() {
        FIRST_SOLVE_BALLOON.clear();
    }
}