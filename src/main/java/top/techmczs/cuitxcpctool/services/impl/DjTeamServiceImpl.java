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

import com.alibaba.excel.EasyExcel;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import top.techmczs.cuitxcpctool.constant.MessageConstant;
import top.techmczs.cuitxcpctool.entity.ExcelTeam;
import top.techmczs.cuitxcpctool.entity.Team;
import top.techmczs.cuitxcpctool.entity.domjudge.DjTeam;
import top.techmczs.cuitxcpctool.entity.domjudge.DjUser;
import top.techmczs.cuitxcpctool.exception.ImportExcelException;
import top.techmczs.cuitxcpctool.mapper.TeamMapper;
import top.techmczs.cuitxcpctool.services.DjTeamService;
import top.techmczs.cuitxcpctool.services.DomjudgeFetchService;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DjTeamServiceImpl implements DjTeamService {

    private final TeamMapper teamMapper;
    private final DomjudgeFetchService domjudgeFetchService;

    public static final String UNKNOWN = "Unknown";
    public static final String NONE = "None";
    // 分页查询
    @Override
    public IPage<Team> queryTeamsByPage(int curPage) {
        Page<Team> page = new Page<>(curPage, 10);
        return teamMapper.selectPage(page, null);
    }

    // Excel导入
    @Override
    public void importTeamExcel(MultipartFile file) {
        try {
            List<ExcelTeam> excelTeams = EasyExcel.read(file.getInputStream())
                    .head(ExcelTeam.class)
                    .sheet()
                    .doReadSync();

            // 构建Excel映射
            Map<String,ExcelTeam> excelTeamMap = null;
            if (excelTeams != null && !excelTeams.isEmpty()) {
                excelTeamMap = excelTeams.stream()
                        .collect(Collectors.toMap(ExcelTeam::getIcpcId, excelTeam -> excelTeam));
            }
            List<Team> teamList = buildTeam(excelTeamMap, null);
            teamMapper.delete(null);
            teamMapper.insert(teamList);
            log.info(MessageConstant.TEAM_IMPORT_SUCCESS, teamList.size());
        } catch (Exception e) {
            log.error(MessageConstant.TEAM_IMPORT_FAILED);
            throw new ImportExcelException(MessageConstant.IMPORT_TEAM_FROM_EXCEL);
        }
    }

    // 刷新同步
    @Override
    public void syncTeamsFromDomjudge() {
        List<Team> dbTeams = teamMapper.selectList(null);
        Map<String, String> passwordMap = dbTeams.stream()
                .collect(Collectors.toMap(Team::getExamNumber, Team::getPassword));

        List<Team> newTeamList = buildTeam(null, passwordMap);
        teamMapper.insertOrUpdate(newTeamList);
        log.info(MessageConstant.TEAM_SYNC_SUCCESS, newTeamList.size());
    }

    // 组装方法
    private List<Team> buildTeam(Map<String, ExcelTeam> excelTeamMap, Map<String, String> passwordMap) {
        // 拉取DJ基础数据
        List<DjTeam> djTeamList = domjudgeFetchService.getTeams();
        List<DjUser> djUsers = domjudgeFetchService.getUsers();

        // 构建DJ用户映射
        Map<String, DjUser> djUserMap = djUsers.stream()
                .filter(user -> user.getTeamId() != null)
                .collect(Collectors.toMap(DjUser::getTeamId, djUser -> djUser));

        List<Team> teamList = new ArrayList<>();
        for (DjTeam djTeam : djTeamList) {
            String icpcId = djTeam.getIcpcId();
            Team team = new Team();
            team.setExamNumber(icpcId);

            // 统一密码赋值逻辑
            ExcelTeam excelTeam = excelTeamMap != null ? excelTeamMap.get(icpcId) : null;
            if (excelTeam != null) {
                // 场景1：Excel导入 → 取Excel密码
                team.setPassword((excelTeam.getPassword() == null || excelTeam.getPassword().isBlank()) ? NONE : excelTeam.getPassword());
            } else if (passwordMap != null) {
                // 场景2：刷新同步 → 取数据库密码
                team.setPassword(passwordMap.getOrDefault(icpcId, UNKNOWN));
            } else {
                // 无密码来源
                team.setPassword(UNKNOWN);
            }

            // 基础信息
            team.setTeamName(djTeam.getName());
            team.setSchool(djTeam.getAffiliation());
            team.setPosition(djTeam.getLocation() != null ? djTeam.getLocation().getDescription() : NONE);

            // 账号信息
            if (djUserMap.containsKey(icpcId)) {
                team.setAccount(djUserMap.get(icpcId).getUsername());
            } else {
                team.setAccount(NONE);
            }

            // 解析队员/教练
            parseTeamMember(team, djTeam.getPublicDescription());

            teamList.add(team);
        }
        return teamList;
    }

    //通用解析队员/教练
    private void parseTeamMember(Team team, String desc) {
        String teammate = NONE;
        String coach = NONE;
        if(desc == null) {
            team.setTeammate(teammate);
            team.setCoach(coach);
            return;
        }
        if (desc.contains(" Coaches: ")) {
            String[] parts = desc.split(" Coaches: ");
            coach = parts[1].trim();
            if (parts[0].contains("Players: ")) {
                teammate = parts[0].replace("Players: ", "").trim();
            }
        } else if (desc.contains("Players: ")) {
            teammate = desc.replace("Players: ", "").trim();
        }
        team.setTeammate(teammate);
        team.setCoach(coach);
    }
}