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

import type {Image, Text} from "./basic-types";
import type {Persons} from "./person";

export interface Team {
  id?: string;
  team_id?: string;

  name?: Text;
  team_name?: Text;

  description?: Text;

  organization?: string;
  organization_id?: string;

  group?: Array<string>;
  tag?: Array<string>;

  coach?: Text | Array<Text> | Persons;
  coaches?: Text | Array<Text> | Persons;
  members?: Text | Array<Text> | Persons;

  official?: boolean;
  unofficial?: boolean;
  girl?: boolean;

  badge?: Image;

  missing_photo?: boolean;
  photo?: Image;

  location?: string;
  icpc_id?: string;

  ip?: string;
}

export type Teams = Array<Team> | Record<string /* team_id */, Team>;
