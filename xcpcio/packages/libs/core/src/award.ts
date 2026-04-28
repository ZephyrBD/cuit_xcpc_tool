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

export enum MedalType {
  UNKNOWN = "Unknown",
  GOLD = "Gold",
  SILVER = "Silver",
  BRONZE = "Bronze",
  HONORABLE = "Honorable",
}

export class Award {
  medalType: MedalType;
  minRank: number;
  maxRank: number;

  constructor() {
    this.medalType = MedalType.UNKNOWN;
    this.minRank = 0;
    this.maxRank = 0;
  }
}

export function isValidMedalType(medal: MedalType): boolean {
  const validMedalType = [
    MedalType.GOLD,
    MedalType.SILVER,
    MedalType.BRONZE,
    MedalType.HONORABLE,
  ];

  return validMedalType.includes(medal);
}

export type Awards = Map<string, Award[]>;
