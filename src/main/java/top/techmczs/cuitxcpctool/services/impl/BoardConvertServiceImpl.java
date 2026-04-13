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

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import top.techmczs.cuitxcpctool.dto.board.BoardContestConfigDTO;
import top.techmczs.cuitxcpctool.dto.board.BoardContestListDTO;
import top.techmczs.cuitxcpctool.dto.board.BoardRunDTO;
import top.techmczs.cuitxcpctool.dto.board.BoardTeamDTO;
import top.techmczs.cuitxcpctool.entity.domjudge.*;
import top.techmczs.cuitxcpctool.services.BoardConvertService;
import top.techmczs.cuitxcpctool.services.DomjudgeFetchService;
import top.techmczs.cuitxcpctool.utils.StatusMappingUtil;
import top.techmczs.cuitxcpctool.utils.TimeUtil;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BoardConvertServiceImpl implements BoardConvertService {

    private final DomjudgeFetchService domjudgeFetchService;

    @Override
    public BoardContestListDTO buildContestList() {
        DjContest contest = domjudgeFetchService.getContest();
        BoardContestListDTO list = new BoardContestListDTO();

        int currentYear = java.time.LocalDate.now().getYear();
        String year = String.valueOf(currentYear);
        String contestKey = contest.getId();

        Map<String, Object> config = new HashMap<>();
        config.put("contest_name", contest.getFormalName());
        config.put("start_time", TimeUtil.isoToMills(contest.getStartTime()));
        config.put("end_time", TimeUtil.isoToMills(contest.getEndTime()));
        config.put("frozen_time", TimeUtil.durationToSeconds(contest.getScoreboardFreezeDuration()));
        config.put("logo", Collections.singletonMap("preset", "ICPC"));

        Map<String, Object> contestNode = new HashMap<>();
        contestNode.put("config", config);
        contestNode.put("board_link", "/icpc/" + currentYear + "/" + contestKey);

        Map<String, Object> contestMap = new HashMap<>();
        contestMap.put(contestKey, contestNode);

        Map<String, Map<String, Object>> icpcRoot = new HashMap<>();
        icpcRoot.put(year, contestMap);

        list.setIcpc(icpcRoot);
        return list;
    }

    @Override
    public BoardContestConfigDTO buildConfig() {
        DjContest contest = domjudgeFetchService.getContest();
        List<DjProblem> problems = domjudgeFetchService.getProblems();

        BoardContestConfigDTO config = new BoardContestConfigDTO();
        config.setContestName(contest.getFormalName());
        config.setStartTime(TimeUtil.isoToMills(contest.getStartTime()));
        config.setEndTime(TimeUtil.isoToMills(contest.getEndTime()));
        config.setPenalty(contest.getPenaltyTime() * 60);
        config.setFrozenTime(TimeUtil.durationToSeconds(contest.getScoreboardFreezeDuration()));

        List<String> problemIds = problems.stream()
                .sorted(Comparator.comparingInt(DjProblem::getOrdinal))
                .map(DjProblem::getLabel)
                .collect(Collectors.toList());
        config.setProblemId(problemIds);

        List<BoardContestConfigDTO.BalloonColor> balloons = problems.stream().map(p -> {
            BoardContestConfigDTO.BalloonColor color = new BoardContestConfigDTO.BalloonColor();
            color.setColor("#000000");
            color.setBackgroundColor(p.getRgb());
            return color;
        }).collect(Collectors.toList());
        config.setBalloonColor(balloons);

        BoardContestConfigDTO.StatusTimeDisplay display = new BoardContestConfigDTO.StatusTimeDisplay();
        display.setCorrect(true);
        display.setIncorrect(true);
        display.setPending(true);
        config.setStatusTimeDisplay(display);

        BoardContestConfigDTO.Medal medal = new BoardContestConfigDTO.Medal();
        BoardContestConfigDTO.Medal.Official official = new BoardContestConfigDTO.Medal.Official();
        official.setGold(0);
        official.setSilver(0);
        official.setBronze(0);
        medal.setOfficial(official);
        config.setMedal(medal);

        BoardContestConfigDTO.Group group = new BoardContestConfigDTO.Group();
        group.setOfficial("正式队伍");
        group.setUnofficial("打星队伍");
        config.setGroup(group);

        BoardContestConfigDTO.Logo logo = new BoardContestConfigDTO.Logo();
        logo.setPreset("ICPC");
        config.setLogo(logo);

        BoardContestConfigDTO.Options options = new BoardContestConfigDTO.Options();
        options.setSubmissionTimestampUnit("millisecond");
        options.setEnableOrganization(true);
        config.setOptions(options);

        return config;
    }

    @Override
    public List<BoardTeamDTO> buildTeams() {
        List<DjTeam> djTeams = domjudgeFetchService.getTeams();
        List<BoardTeamDTO> result = new ArrayList<>();

        for (DjTeam dj : djTeams) {
            if (Boolean.TRUE.equals(dj.getHidden())) continue;

            BoardTeamDTO team = new BoardTeamDTO();
            team.setId(dj.getId());
            team.setName(dj.getName());
            team.setOrganization(Objects.requireNonNullElse(dj.getAffiliation(), ""));
            team.setGroup(dj.getGroupIds().contains("participants") ? List.of("official") : List.of("unofficial"));
            team.setLocation(dj.getLocation() != null ? dj.getLocation().getDescription() : "");
            team.setIcpcId(Objects.requireNonNullElse(dj.getIcpcId(), ""));

            BoardTeamDTO.Name name = new BoardTeamDTO.Name();
            name.setFallbackLang("zh-CN");
            name.setTexts(Collections.singletonMap("zh-CN", ""));

            BoardTeamDTO.Coach coach = new BoardTeamDTO.Coach();
            coach.setName(name);
            team.setCoaches(List.of(coach));

            BoardTeamDTO.Member member = new BoardTeamDTO.Member();
            member.setName(name);
            team.setMembers(List.of(member));

            result.add(team);
        }
        return result;
    }

    @Override
    public List<BoardRunDTO> buildRuns() {
        List<DjSubmission> submissions = domjudgeFetchService.getSubmissions();
        List<DjJudgement> judgements = domjudgeFetchService.getJudgements();
        List<DjProblem> problems = domjudgeFetchService.getProblems();

        Map<String, String> judgeMap = judgements.stream()
                .collect(Collectors.toMap(DjJudgement::getSubmissionId, DjJudgement::getJudgementTypeId));
        Map<String, Integer> problemMap = problems.stream()
                .collect(Collectors.toMap(DjProblem::getId, DjProblem::getOrdinal));

        List<BoardRunDTO> runs = new ArrayList<>();
        for (DjSubmission sub : submissions) {
            BoardRunDTO run = new BoardRunDTO();
            run.setId(sub.getId());
            run.setTeamId(sub.getTeamId());
            run.setProblemId(problemMap.get(sub.getProblemId()));
            run.setTimestamp(TimeUtil.durationToSeconds(sub.getContestTime()));
            run.setStatus(StatusMappingUtil.convert(judgeMap.getOrDefault(sub.getId(), "PENDING")));
            run.setLanguage("C++");
            runs.add(run);
        }
        return runs;
    }
}
