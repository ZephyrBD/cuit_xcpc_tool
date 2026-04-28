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

import chroma from "chroma-js";
import {furthest} from "color-diff";

export function getWhiteOrBlackColorV1(background: string) {
  const [R, G, B] = chroma(background).rgb();
  const color = { R, G, B };
  const palette = [
    { R: 0, G: 0, B: 0 },
    { R: 255, G: 255, B: 255 },
  ];

  const f = furthest(color, palette);

  if (f.R === 0 && f.G === 0 && f.B === 0) {
    return "#000";
  } else {
    return "#fff";
  }
}

export function getWhiteOrBlackColor(background: string) {
  const [R, G, B] = chroma(background).rgb();

  const brightness = (R * 299 + G * 587 + B * 114) / 1000;
  const threshold = 148;

  return brightness <= threshold ? "#fff" : "#000";
}
