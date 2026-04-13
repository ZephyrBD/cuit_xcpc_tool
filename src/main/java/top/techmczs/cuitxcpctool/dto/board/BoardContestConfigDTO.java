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

@Data
@Accessors(chain=true)
public class BoardContestConfigDTO {
    @JsonProperty("contest_name")
    private String contestName;

    @JsonProperty("start_time")
    private long startTime;

    @JsonProperty("end_time")
    private long endTime;

    @JsonProperty("penalty")
    private int penalty;

    @JsonProperty("frozen_time")
    private int frozenTime;

    @JsonProperty("problem_id")
    private List<String> problemId;

    @JsonProperty("balloon_color")
    private List<BalloonColor> balloonColor;

    @JsonProperty("status_time_display")
    private StatusTimeDisplay statusTimeDisplay;

    @JsonProperty("medal")
    private Medal medal;

    @JsonProperty("group")
    private Group group;

    @JsonProperty("logo")
    private Logo logo;

    @JsonProperty("options")
    private Options options;

    @Data
    public static class BalloonColor {
        @JsonProperty("color")
        private String color;
        @JsonProperty("background_color")
        private String backgroundColor;
    }

    @Data
    public static class StatusTimeDisplay {
        @JsonProperty("correct")
        private boolean correct;
        @JsonProperty("incorrect")
        private boolean incorrect;
        @JsonProperty("pending")
        private boolean pending;
    }

    @Data
    public static class Medal {
        @JsonProperty("official")
        private Official official;
        @Data
        public static class Official {
            @JsonProperty("gold")
            private int gold;
            @JsonProperty("silver")
            private int silver;
            @JsonProperty("bronze")
            private int bronze;
        }
    }

    @Data
    public static class Group {
        @JsonProperty("official")
        private String official;
        @JsonProperty("unofficial")
        private String unofficial;
    }

    @Data
    public static class Logo {
        @JsonProperty("preset")
        private String preset;
    }

    @Data
    public static class Options {
        @JsonProperty("submission_timestamp_unit")
        private String submissionTimestampUnit;
        @JsonProperty("enable_organization")
        private boolean enableOrganization;
    }
}
