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

import type {Person as IPerson, Persons as IPersons, Text as IText} from "@xcpcio/types";
import {I18nText} from "./basic-types";

export class Person {
  name: I18nText;

  cfID?: string;
  icpcID?: string;

  constructor(name?: I18nText) {
    this.name = name ?? new I18nText();
  }

  toIPerson(): IPerson {
    return {
      name: this.name.toI18NStringSet(),
      cf_id: this.cfID,
      icpc_id: this.icpcID,
    };
  }

  static fromIPerson(iPerson: IPerson): Person {
    const person = new Person();
    person.name = I18nText.fromIText(iPerson.name);
    person.cfID = iPerson.cf_id;
    person.icpcID = iPerson.icpc_id;
    return person;
  }
}

export type Persons = Array<Person>;

export function createPersons(iPersons?: IText | Array<IText> | IPersons): Persons {
  if (!iPersons) {
    return [];
  }

  if (typeof iPersons === "string") {
    for (const c of " ,、|") {
      if (iPersons.includes(c)) {
        return iPersons.split(c).map(name => new Person(I18nText.fromIText(name)));
      }
    }

    return [new Person(I18nText.fromIText(iPersons))];
  }

  if (Array.isArray(iPersons)) {
    if (iPersons.length > 0 && typeof iPersons[0] === "object" && "name" in iPersons[0]) {
      return iPersons.map(iPerson => Person.fromIPerson(iPerson as IPerson));
    }

    return iPersons.map(name => new Person(I18nText.fromIText(name as IText)));
  }

  return [new Person(I18nText.fromIText(iPersons))];
}
