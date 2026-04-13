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

package top.techmczs.cuitxcpctool.dto.board;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import java.util.List;
import java.util.Map;

@Data
@Accessors(chain=true)
public class BoardTeamDTO {
    @JsonProperty("id")
    private String id;

    @JsonProperty("name")
    private String name;

    @JsonProperty("organization")
    private String organization;

    @JsonProperty("group")
    private List<String> group;

    @JsonProperty("coaches")
    private List<Coach> coaches;

    @JsonProperty("members")
    private List<Member> members;

    @JsonProperty("location")
    private String location;

    @JsonProperty("icpc_id")
    private String icpcId;

    @Data
    public static class Coach {
        @JsonProperty("name")
        private Name name;
    }

    @Data
    public static class Member {
        @JsonProperty("name")
        private Name name;
    }

    @Data
    public static class Name {
        @JsonProperty("fallback_lang")
        private String fallbackLang;
        @JsonProperty("texts")
        private Map<String, String> texts;
    }
}
