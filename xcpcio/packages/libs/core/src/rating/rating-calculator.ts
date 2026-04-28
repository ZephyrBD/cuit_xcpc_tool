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

import type {RatingUsers} from "./rating-user";
import {RatingUser} from "./rating-user";

// https://www.wikiwand.com/en/Elo_rating_system
export class RatingCalculator {
  users: RatingUsers;

  constructor() {
    this.users = [];
  }

  calculate() {
    this.calculateInternal();
  }

  private calcP(userA: RatingUser, userB: RatingUser) {
    return 1.0 / (1.0 + 10 ** ((userB.oldRating - userA.oldRating) / 400.0));
  }

  private getExSeed(users: RatingUsers, rating: number, ownUser: RatingUser) {
    const exUser = new RatingUser();
    exUser.oldRating = rating;

    let res = 0;

    users.forEach((user) => {
      if (user.id !== ownUser.id) {
        res += this.calcP(user, exUser);
      }
    });

    return res;
  }

  private calcRating(users: RatingUsers, rank: number, user: RatingUser) {
    let left = 1;
    let right = 8000;

    while (right - left > 1) {
      const mid = Math.floor((left + right) / 2);
      if (this.getExSeed(users, mid, user) < rank) {
        right = mid;
      } else {
        left = mid;
      }
    }

    return left;
  }

  private calculateInternal() {
    // Calculate seed
    for (let i = 0; i < this.users.length; i++) {
      const u = this.users[i];
      u.seed = 1.0;
      for (let j = 0; j < this.users.length; j++) {
        if (i !== j) {
          const otherUser = this.users[j];
          u.seed += this.calcP(otherUser, u);
        }
      }
    }

    // Calculate initial delta and sumDelta
    let sumDelta = 0;
    for (let i = 0; i < this.users.length; i++) {
      const u = this.users[i];
      u.delta = Math.floor(
        (this.calcRating(this.users, Math.sqrt(u.rank * u.seed), u)
          - u.oldRating)
        / 2,
      );
      sumDelta += u.delta;
    }

    // Calculate first inc
    let inc = Math.floor(-sumDelta / this.users.length) - 1;
    for (let i = 0; i < this.users.length; i++) {
      const u = this.users[i];
      u.delta += inc;
    }

    // Calculate second inc
    this.users = this.users.sort((a, b) => b.oldRating - a.oldRating);
    const s = Math.min(this.users.length, Math.floor(4 * Math.round(Math.sqrt(this.users.length))));
    let sumS = 0;
    for (let i = 0; i < s; i++) {
      sumS += this.users[i].delta;
    }
    inc = Math.min(Math.max(Math.floor(-sumS / s), -10), 0);

    // Calculate new rating
    this.users.forEach((u) => {
      u.delta += inc;
      u.UpdateRating(u.oldRating + u.delta);
    });

    this.users = this.users.sort((a, b) => a.rank - b.rank);
  }
}
