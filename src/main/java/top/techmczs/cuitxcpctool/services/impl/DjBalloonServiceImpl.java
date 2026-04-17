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
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
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
import java.util.concurrent.CopyOnWriteArrayList;

@Service
@Slf4j
@RequiredArgsConstructor
public class DjBalloonServiceImpl implements DjBalloonService {

    // 注入全局SSE管理器
    private final SseManagerService sseManagerService;

    // 待推送气球队列
    private final List<DjBalloon> NEW_BALLOONS = new CopyOnWriteArrayList<>();
    private final Map<String, DjBalloon> FIRST_SOLVE_BALLOON = Collections.synchronizedMap(new HashMap<>());

    private final DomjudgeFetchService domjudgeFetchService;
    private final ToolProperties toolProperties;

    @Scheduled(fixedRate = 500)
    public void pushBalloonToClients() {
        if (NEW_BALLOONS.isEmpty()) {
            sseManagerService.sendHeartbeat();
            return;
        }

        List<DjBalloon> tempList = new ArrayList<>(NEW_BALLOONS);
        NEW_BALLOONS.clear();

        for (DjBalloon dto : tempList) {
            try {
                BalloonTaskDTO balloonTaskDTO = DjBallonToBalloon(dto);
                // 走全局SSE广播
                sseManagerService.broadcast(SseEventConstant.BALLOON_TASK, Result.success(balloonTaskDTO));
                log.info(MessageConstant.PUSH_BALLOON_TASK_SUCCESS, balloonTaskDTO.getBalloonId());
            } catch (Exception e) {
                log.error(MessageConstant.SKIP_BALLOON_TASK);
            }
        }
    }

    @Scheduled(fixedRate = 1000)
    public void getBalloonFromDomjudge() {
        fetchBalloon(true);
    }

    @Override
    public IPage<BalloonTaskDTO> getAllBalloonFromDomjudge(int cur) {
        List<DjBalloon> dtoList = fetchBalloon(false);
        List<BalloonTaskDTO> balloonTaskDTOList = dtoList.stream().map(this::DjBallonToBalloon).toList();

        Page<BalloonTaskDTO> page = new Page<>(cur, 10);
        page.setRecords(balloonTaskDTOList);
        page.setTotal(balloonTaskDTOList.size());
        return page;
    }

    private List<DjBalloon> fetchBalloon(boolean isTodo) {
        try {
            List<DjBalloon> dtoList = domjudgeFetchService.getBalloons(isTodo);
            dtoList.sort(Comparator.comparing(DjBalloon::getTime));
            if (isTodo && !dtoList.isEmpty()) {
                for (DjBalloon dto : dtoList) {
                    if(toolProperties.isShouldForbiddenOnlinePrint() && dto.getLocation().equals(toolProperties.getOnlineLocationKey())){
                        setBalloonDone(dto.getBalloonId());
                        continue;
                    }
                    NEW_BALLOONS.add(dto);
                }
            }

            return dtoList;
        } catch (Exception e) {
            log.error(MessageConstant.GET_BALLOON_ERROR,e.getMessage());
            return Collections.emptyList();
        }
    }

    private BalloonTaskDTO DjBallonToBalloon(DjBalloon balloonDto) {
        try {
            String problemId = balloonDto.getContestProblem().getShortName();
            Long currentBalloonId = balloonDto.getBalloonId();
            double currentTime = Double.parseDouble(balloonDto.getTime());

            boolean isFirst;

            // 该题目还没有记录 → 一定是首杀
            if (!FIRST_SOLVE_BALLOON.containsKey(problemId)) {
                isFirst = true;
                FIRST_SOLVE_BALLOON.put(problemId, balloonDto);
            } else {
                // 已有记录，取出之前存的最早气球
                DjBalloon firstBalloon = FIRST_SOLVE_BALLOON.get(problemId);
                double firstTime = Double.parseDouble(firstBalloon.getTime());

                // 时间更早 → 替换成真正的首杀
                if (currentTime < firstTime) {
                    isFirst = true;
                    FIRST_SOLVE_BALLOON.put(problemId, balloonDto);
                }
                // 同一个气球重复拉取 → 依然标记首杀
                else isFirst = currentBalloonId.equals(firstBalloon.getBalloonId());
            }

            String teamName = balloonDto.getTeam();
            if (teamName != null && teamName.contains(": ")) {
                teamName = teamName.split(": ")[1];
            }

            BalloonTaskDTO balloonTaskDTO = new BalloonTaskDTO();
            balloonTaskDTO.setBalloonId(balloonDto.getBalloonId())
                    .setProblem(balloonDto.getContestProblem().getShortName())
                    .setTeamName(teamName)
                    .setTeamLocation(balloonDto.getLocation())
                    .setColorName(balloonDto.getContestProblem().getColor())
                    .setTime(TimeUtil.timestampToLocalDateTime(Double.parseDouble(balloonDto.getTime())))
                    .setIsFinished(balloonDto.getDone())
                    .setIsFirst(isFirst);

            return balloonTaskDTO;
        } catch (Exception e) {
            return new BalloonTaskDTO();
        }
    }

    @Override
    public void setBalloonDone(Long id) {
        domjudgeFetchService.setBalloonDone(id);
    }
}