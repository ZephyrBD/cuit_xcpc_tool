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

import type {Image, Organization as IOrganization, Organizations as IOrganizations} from "@xcpcio/types";

import type {Teams} from "./team";

import {I18nText} from "./basic-types";

export class Organization {
  id: string;
  name: I18nText;

  logo?: Image;
  icpcID?: string;

  // Teams belonging to this organization
  teams: Teams;

  rank: number;

  constructor() {
    this.id = "";
    this.name = new I18nText();

    this.teams = [];

    this.rank = -1;
  }

  reset() {
    this.rank = -1;
  }

  static compare(lhs: Organization, rhs: Organization): number {
    if (lhs.id < rhs.id) {
      return -1;
    } else if (lhs.id > rhs.id) {
      return 1;
    }

    return 0;
  }
}

export type Organizations = Array<Organization>;

export function createOrganization(orgJSON: IOrganization): Organization {
  const org = new Organization();

  org.id = orgJSON.id;
  org.name = I18nText.fromIText(orgJSON.name);

  org.logo = orgJSON.logo;
  org.icpcID = orgJSON.icpc_id;

  return org;
}

export function createOrganizations(orgsJSON: IOrganizations): Organizations {
  return orgsJSON.map(org => createOrganization(org));
}
