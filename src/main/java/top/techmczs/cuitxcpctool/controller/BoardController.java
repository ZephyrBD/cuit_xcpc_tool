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

package top.techmczs.cuitxcpctool.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import top.techmczs.cuitxcpctool.dto.board.BoardContestConfigDTO;
import top.techmczs.cuitxcpctool.dto.board.BoardContestListDTO;
import top.techmczs.cuitxcpctool.dto.board.BoardRunDTO;
import top.techmczs.cuitxcpctool.dto.board.BoardTeamDTO;
import top.techmczs.cuitxcpctool.services.BoardConvertService;

import java.util.List;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/public/board/data")
@Tag(name = "Board", description = "处理返回给XCPCIO Board的信息接口")
public class BoardController {

    private final BoardConvertService boardConvertService;

    // 返回 contest_list.json
    @GetMapping("/index/contest_list.json")
    @Operation(description = "返回Board比赛列表，这里只会返回{cid}这场比赛")
    public BoardContestListDTO contestList() {
        return boardConvertService.buildContestList();
    }

    // 返回 config.json
    @GetMapping("/icpc/{year}/{cid}/config.json")
    @Operation(description = "返回Board比赛配置")
    public BoardContestConfigDTO config() {
        return boardConvertService.buildConfig();
    }

    // 返回 team.json
    @GetMapping("/icpc/{year}/{cid}/team.json")
    @Operation(description = "返回Board队伍信息")
    public List<BoardTeamDTO> team() {
        return boardConvertService.buildTeams();
    }

    // 返回 run.json
    @GetMapping("/icpc/{year}/{cid}/run.json")
    @Operation(description = "返回Board需要的提交列表")
    public List<BoardRunDTO> run() {
        return boardConvertService.buildRuns();
    }
}
