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

import {useRouteQueryWithoutParam} from "./useRouteQueryWithoutParam";

export function useQueryForSearch() {
  return useRouteQueryWithoutParam(
    "s",
    "",
    { transform: String },
  );
}

export function useQueryForDataSourceUrl() {
  return useRouteQueryWithoutParam(
    "data-source",
    "",
    { transform: String },
  );
}

export function useQueryForGroup() {
  return useRouteQueryWithoutParam(
    "group",
    "all",
    { transform: String },
  );
}

export function useQueryForReplayStartTime() {
  return useRouteQueryWithoutParam(
    "replay-start-time",
    "0",
    { transform: Number },
  );
}

export function useQueryForProgressRatio() {
  return useRouteQueryWithoutParam(
    "progress-ratio",
    -1,
    { transform: Number },
  );
}

export function useQueryForBattleOfGiants() {
  return useRouteQueryWithoutParam(
    "battle-of-giants",
    "",
    { transform: String },
  );
}

export function useQueryForComponent() {
  return useRouteQueryWithoutParam(
    "component",
    "board",
    { transform: String },
  );
}
