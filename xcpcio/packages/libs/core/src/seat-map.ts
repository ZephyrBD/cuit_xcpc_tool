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

import type {SeatMap as ISeatMap, SeatMapSection as ISeatMapSection} from "@xcpcio/types";

import type {Team, Teams} from "./team";

import {I18nText} from "./basic-types";

export class SeatMapSection {
  title: I18nText;
  rowLabels: Array<string | null>;
  grid: Array<Array<string | null>>;

  constructor() {
    this.title = new I18nText();
    this.rowLabels = [];
    this.grid = [];
  }
}

export class SeatMap {
  sections: Array<SeatMapSection>;

  constructor() {
    this.sections = [];
  }

  /**
   * Build a map from seat IDs (from team.location) to teams
   */
  buildSeatToTeamMap(teams: Teams): Map<string, Team> {
    const map = new Map<string, Team>();

    for (const team of teams) {
      if (team.location) {
        map.set(team.location, team);
      }
    }

    return map;
  }
}

export function createSeatMapSection(sectionJSON: ISeatMapSection): SeatMapSection {
  const s = new SeatMapSection();

  s.title = I18nText.fromIText(sectionJSON.title ?? "");
  s.rowLabels = sectionJSON.rowLabels ?? [];
  s.grid = sectionJSON.grid ?? [];

  return s;
}

export function createSeatMap(seatMapJSON: ISeatMap): SeatMap {
  const sm = new SeatMap();

  sm.sections = (seatMapJSON.sections ?? []).map(createSeatMapSection);

  return sm;
}
