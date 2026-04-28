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

import type {Rank} from "../rank";

import {SubmissionStatus} from "@xcpcio/types";

import {isAccepted, isNotCalculatedPenaltyStatus, isPending,} from "../submission-status";

import dayjs from "../utils/dayjs";

export interface Options {
  includeFakeRussianTeams?: boolean;
};

export class CodeforcesGymGhostDATConverter {
  constructor() {}

  public convert(rank: Rank, options?: Options): string {
    const includeFakeRussianTeams = options?.includeFakeRussianTeams ?? false;
    const fakeTeamsCount = includeFakeRussianTeams ? 100 : 0;

    let res = "";

    res += `@contest "${rank.contest.name.getOrDefault()}"
@contlen ${Math.floor(dayjs.duration(rank.contest.endTime.diff(rank.contest.startTime)).asMinutes())}
@problems ${rank.contest.problems.length}
@teams ${rank.teams.length + fakeTeamsCount}
@submissions ${rank.submissions.length}
`;

    rank.contest.problems.forEach((p) => {
      res += `@p ${p.label},${p.label},20,0\n`;
    });

    let teamIndex = 1;
    const teamIdMap = new Map<string, number>();
    const submissionsIdMap = new Map<string, Map<string, number>>();

    rank.teams.forEach((team) => {
      let name = team.name.getOrDefault();

      if (team.organization) {
        name = `${team.organization.name.getOrDefault()} - ${name}`;
      }

      if (team.members) {
        name = `${name} - ${team.membersToString()}`;
      }

      res += `@t ${teamIndex},0,1,"${name}"\n`;
      teamIdMap.set(team.id, teamIndex);
      teamIndex++;

      {
        const mp = new Map<string, number>();
        rank.contest.problems.forEach((p) => {
          mp.set(p.id, 0);
        });
        submissionsIdMap.set(team.id, mp);
      }
    });

    if (includeFakeRussianTeams) {
      for (let i = 0; i < 100; i++) {
        res += `@t ${teamIndex},0,1,"Пополнить команду"\n`;
        teamIndex++;
      }
    }

    rank.getSubmissions().forEach((submission) => {
      const teamId = submission.teamId;
      const problemId = submission.problemId;
      const problem = rank.contest.problemsMap.get(problemId);
      const teamIndex = teamIdMap.get(teamId);

      if (!problem) {
        return;
      }

      if (!teamIndex) {
        return;
      }

      const status = this.submissionStatusToCodeforcesGymDatStatus(submission.status);
      submissionsIdMap.get(teamId)!.set(problemId, submissionsIdMap.get(teamId)!.get(problemId)! + 1);

      res += `@s ${teamIndex},${problem.label},${submissionsIdMap.get(teamId)?.get(problemId)},${submission.timestampToSecond},${status}\n`;
    });

    return res;
  }

  private submissionStatusToCodeforcesGymDatStatus(status: SubmissionStatus): string {
    if (isAccepted(status)) {
      return "OK";
    }

    if (status === SubmissionStatus.WRONG_ANSWER) {
      return "WA";
    }

    if (status === SubmissionStatus.TIME_LIMIT_EXCEEDED) {
      return "TL";
    }

    if (status === SubmissionStatus.MEMORY_LIMIT_EXCEEDED) {
      return "ML";
    }

    if (status === SubmissionStatus.OUTPUT_LIMIT_EXCEEDED) {
      return "IL";
    }

    if (status === SubmissionStatus.PRESENTATION_ERROR) {
      return "PE";
    }

    if (status === SubmissionStatus.RUNTIME_ERROR) {
      return "RT";
    }

    if (status === SubmissionStatus.COMPILATION_ERROR || isNotCalculatedPenaltyStatus(status)) {
      return "CE";
    }

    if (isPending(status)) {
      return "PD";
    }

    return "RJ";
  }
}
