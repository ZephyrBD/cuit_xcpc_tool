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

import type {Contest as IContest, ContestIndex as IContestIndex, Image} from "@xcpcio/types";
import type dayjs from "dayjs";

import {I18nText} from "./basic-types";
import {Contest, createContest} from "./contest";
import {createDayJS} from "./utils";

export class ContestIndexConfig {
  contestName: I18nText;

  startTime: dayjs.Dayjs;
  endTime: dayjs.Dayjs;
  freezeTime: dayjs.Dayjs;

  totalDurationTimestamp: number;
  freezeDurationTimestamp: number;
  unFreezeDurationTimestamp: number;

  logo?: Image;

  constructor() {
    this.contestName = new I18nText();

    this.startTime = createDayJS();
    this.endTime = createDayJS();
    this.freezeTime = createDayJS();

    this.totalDurationTimestamp = 0;
    this.freezeDurationTimestamp = 0;
    this.unFreezeDurationTimestamp = 0;
  }
}

export class ContestIndex {
  contest: Contest;
  boardLink: string;

  constructor() {
    this.contest = new Contest();
    this.boardLink = "";
  }
}

export type ContestIndexList = Array<ContestIndex>;

export function createContestIndex(contestIndexJSON: IContestIndex): ContestIndex {
  const c = new ContestIndex();
  const cjc = contestIndexJSON.config;

  c.contest = createContest(cjc as IContest);
  c.boardLink = contestIndexJSON.board_link;

  return c;
}

export function createContestIndexList(contestListJSON: any): ContestIndexList {
  const contestIndexList = [] as ContestIndexList;

  const dfs = (contestList: any) => {
    if (Object.prototype.hasOwnProperty.call(contestList, "config")) {
      contestIndexList.push(createContestIndex(contestList));
    } else {
      for (const k in contestList) {
        dfs(contestList[k]);
      }
    }
  };

  dfs(contestListJSON);

  contestIndexList.sort((a: ContestIndex, b: ContestIndex) => {
    if (a.contest.startTime.isBefore(b.contest.startTime)) {
      return 1;
    }

    if (a.contest.startTime.isAfter(b.contest.startTime)) {
      return -1;
    }

    if (a.contest.endTime.isBefore(b.contest.endTime)) {
      return 1;
    }

    if (a.contest.endTime.isAfter(b.contest.endTime)) {
      return -1;
    }

    if (a.contest.name < b.contest.name) {
      return 1;
    }

    if (a.contest.name > b.contest.name) {
      return -1;
    }

    return 0;
  });

  return contestIndexList;
}
