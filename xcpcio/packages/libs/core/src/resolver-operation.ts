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

import {TeamProblemStatistics} from "./problem";
import {Team} from "./team";

export class ResolverOperation {
  id: number;

  team: Team;
  problemIx: number;

  beforeTeamProblemStatistics: TeamProblemStatistics;
  afterTeamProblemStatistics: TeamProblemStatistics;

  constructor() {
    this.id = 0;

    this.team = new Team();
    this.problemIx = 0;

    this.beforeTeamProblemStatistics = new TeamProblemStatistics();
    this.afterTeamProblemStatistics = new TeamProblemStatistics();
  }
}
