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
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import top.techmczs.cuitxcpctool.constant.MessageConstant;
import top.techmczs.cuitxcpctool.constant.SseEventConstant;
import top.techmczs.cuitxcpctool.dto.BalloonTaskDTO;
import top.techmczs.cuitxcpctool.entity.domjudge.DjBalloon;
import top.techmczs.cuitxcpctool.properties.DomjudgeProperties;
import top.techmczs.cuitxcpctool.result.Result;
import top.techmczs.cuitxcpctool.services.DjBalloonService;
import top.techmczs.cuitxcpctool.services.SseManagerService;
import top.techmczs.cuitxcpctool.utils.TimeUtil;

import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
@Slf4j
@RequiredArgsConstructor
public class DjBalloonServiceImpl implements DjBalloonService {

    // 注入全局SSE管理器
    @Resource
    private SseManagerService sseManagerService;

    private final DomjudgeProperties domjudgeProperties;
    @Resource
    private RestTemplate restTemplate;
    @Resource
    private ObjectMapper objectMapper;

    // 待推送气球队列
    private final List<DjBalloon> NEW_BALLOONS = new CopyOnWriteArrayList<>();
    private final Map<String, Long> FIRST_SOLVE = Collections.synchronizedMap(new HashMap<>());

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
        List<BalloonTaskDTO> balloonTaskDTOList = Objects.nonNull(dtoList) ?
                dtoList.stream().map(this::DjBallonToBalloon).toList() : Collections.emptyList();

        Page<BalloonTaskDTO> page = new Page<>(cur, 10);
        page.setRecords(balloonTaskDTOList);
        page.setTotal(balloonTaskDTOList.size());
        return page;
    }

    private List<DjBalloon> fetchBalloon(boolean isTodo) {
        try {
            String basicAuth = domjudgeProperties.getBasicAuth();

            RequestEntity<Void> request = RequestEntity
                    .get(domjudgeProperties.getDomjudgeBalloonApiUrl(isTodo))
                    .header(HttpHeaders.AUTHORIZATION, basicAuth)
                    .accept(MediaType.APPLICATION_JSON)
                    .build();

            ResponseEntity<String> response = restTemplate.exchange(request, String.class);
            List<DjBalloon> dtoList = objectMapper.readValue(response.getBody(), new TypeReference<>() {});

            log.info(MessageConstant.GET_BALLOON_TASK_SUCCESS,
                    isTodo ? MessageConstant.TASK_TO_DO : MessageConstant.TASK_ALL,
                    dtoList == null ? 0 : dtoList.size());

            if (isTodo && dtoList != null && !dtoList.isEmpty()) {
                NEW_BALLOONS.addAll(dtoList);
            }

            return dtoList;
        } catch (Exception e) {
            log.error(MessageConstant.GET_BALLOON_ERROR,e.getMessage());
            return Collections.emptyList();
        }
    }

    private BalloonTaskDTO DjBallonToBalloon(DjBalloon balloonDto) {
        try {
            boolean isFirst =
                    !FIRST_SOLVE.containsKey(balloonDto.getContestProblem().getShortName())
                    || FIRST_SOLVE.get(balloonDto.getContestProblem().getShortName()).equals(balloonDto.getBalloonId());

            if (FIRST_SOLVE.containsKey(balloonDto.getContestProblem().getShortName())) {
                FIRST_SOLVE.put(balloonDto.getContestProblem().getShortName(), balloonDto.getBalloonId());
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
        try {
            String auth = domjudgeProperties.getAuth();
            String basicAuth = "Basic " + Base64.getEncoder().encodeToString(auth.getBytes(StandardCharsets.UTF_8));
            String url = domjudgeProperties.getDomjudgeBalloonDoneUrl(id);

            RequestEntity<Void> request = RequestEntity
                    .post(url)
                    .header(HttpHeaders.AUTHORIZATION, basicAuth)
                    .build();
            restTemplate.exchange(request, String.class);
        } catch (Exception e) {
            log.error(MessageConstant.SET_BALLOON_TASK_DONE_FAILED, id);
        }
    }
}