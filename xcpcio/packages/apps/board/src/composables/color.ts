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

import type {Submission, Team} from "@xcpcio/core";
import {MedalType} from "@xcpcio/core";

export function getMedalColor(team: Team): { backgroundColor: string; color: string } | undefined {
  const color = {
    backgroundColor: "#fff",
    color: "#000",
  };

  if (team.awards.includes(MedalType.GOLD)) {
    color.backgroundColor = "#fff566";
    return color;
  }

  if (team.awards.includes(MedalType.SILVER)) {
    color.backgroundColor = "#ffadd2";
    return color;
  }

  if (team.awards.includes(MedalType.BRONZE)) {
    color.backgroundColor = "#f0c0a0";
    return color;
  }

  if (team.awards.includes(MedalType.HONORABLE)) {
    color.backgroundColor = "#e6f7ff";
    return color;
  }

  return undefined;
}

export function getStandingsStatusColor(submission: Submission) {
  if (submission.isFirstSolved) {
    return "#3db03d";
  }

  if (submission.isAccepted()) {
    return "#e1ffb5";
  }

  if (submission.isPending()) {
    return "#c8d6fa";
  }

  return "#ffd0d0";
}
