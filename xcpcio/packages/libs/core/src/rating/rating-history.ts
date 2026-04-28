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

import type {IRatingHistory} from "@xcpcio/types";
import type {Persons} from "../person";
import {createPersons} from "../person";
import type {dayjs} from "../utils";
import {createDayJS} from "../utils";

import {I18nText} from "../basic-types";

export class RatingHistory {
  rank: number;
  rating: number;

  teamName: I18nText;
  organization: string;

  members: Persons;
  coaches: Persons;

  contestID: string;
  contestName: I18nText;
  contestLink: string;
  contestTime: dayjs.Dayjs;

  constructor() {
    this.rank = 0;
    this.rating = 0;

    this.teamName = new I18nText();
    this.organization = "";

    this.members = [];
    this.coaches = [];

    this.contestID = "";
    this.contestName = new I18nText();
    this.contestLink = "";
    this.contestTime = createDayJS();
  }

  toJSON(): IRatingHistory {
    return {
      rank: this.rank,
      rating: this.rating,

      teamName: this.teamName.toI18NStringSet(),
      organization: this.organization,

      members: this.members.map(member => member.toIPerson()),
      coaches: this.coaches.map(coach => coach.toIPerson()),

      contestID: this.contestID,
      contestName: this.contestName.toI18NStringSet(),
      contestLink: this.contestLink,
      contestTime: this.contestTime.toDate(),
    };
  }

  static fromJSON(iRatingHistory: IRatingHistory | string): RatingHistory {
    if (typeof iRatingHistory === "string") {
      iRatingHistory = JSON.parse(iRatingHistory) as IRatingHistory;
    }

    const ratingHistory = new RatingHistory();
    ratingHistory.rank = iRatingHistory.rank;
    ratingHistory.rating = iRatingHistory.rating;

    ratingHistory.teamName = I18nText.fromIText(iRatingHistory.teamName);
    ratingHistory.organization = iRatingHistory.organization;

    ratingHistory.members = createPersons(iRatingHistory.members);
    ratingHistory.coaches = createPersons(iRatingHistory.coaches);

    ratingHistory.contestID = iRatingHistory.contestID;
    ratingHistory.contestName = I18nText.fromIText(iRatingHistory.contestName);
    ratingHistory.contestLink = iRatingHistory.contestLink;
    ratingHistory.contestTime = createDayJS(iRatingHistory.contestTime);

    return ratingHistory;
  }
}

export type RatingHistories = Array<RatingHistory>;
