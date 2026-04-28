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

import dayjs from "dayjs";

import advancedFormat from "dayjs/plugin/advancedFormat";
import duration from "dayjs/plugin/duration";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import minMax from "dayjs/plugin/minMax";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(duration);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advancedFormat);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(minMax);

dayjs.extend(relativeTime);

export function createDayJS(time: Date | string | number | undefined = undefined): dayjs.Dayjs {
  if (time === undefined) {
    return dayjs();
  }

  if (typeof time == "number" && String(time).length === 10) {
    return dayjs.unix(time);
  }

  return dayjs(time);
}

export function getTimestamp(time: number | dayjs.Dayjs): number {
  if (typeof time === "number") {
    return time;
  }

  return time.unix();
}

export function getTimeDiff(seconds: number): string {
  const two = (a: number) => {
    if (a < 10) {
      return `0${a}`;
    }

    return String(a);
  };

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  return [two(h), two(m), two(s)].join(":");
}

export { dayjs };
export default dayjs;
