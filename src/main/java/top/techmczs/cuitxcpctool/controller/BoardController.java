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
public class BoardController {

    private final BoardConvertService boardConvertService;

    // 1. 返回 contest_list.json
    @GetMapping("/index/contest_list.json")
    public BoardContestListDTO contestList() {
        return boardConvertService.buildContestList();
    }

    // 2. 返回 config.json
    @GetMapping("/icpc/{year}/{cid}/config.json")
    public BoardContestConfigDTO config() {
        return boardConvertService.buildConfig();
    }

    // 3. 返回 team.json
    @GetMapping("/icpc/{year}/{cid}/team.json")
    public List<BoardTeamDTO> team() {
        return boardConvertService.buildTeams();
    }

    // 4. 返回 run.json
    @GetMapping("/icpc/{year}/{cid}/run.json")
    public List<BoardRunDTO> run() {
        return boardConvertService.buildRuns();
    }
}
