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

import type {Image} from "@xcpcio/types";

import {GET_LOGO_CCPC} from "./ccpc";
import {GET_LOGO_HUNAN_CPC} from "./hunan-cpc";
import {GET_LOGO_ICPC} from "./icpc";

export function getLogoFromPreset(image: Image): Image {
  if (!image.preset) {
    return image;
  }

  const preset = image.preset.toUpperCase();

  if (preset === "ICPC") {
    return GET_LOGO_ICPC();
  }

  if (preset === "CCPC") {
    return GET_LOGO_CCPC();
  }

  if (preset === "HUNAN_CPC") {
    return GET_LOGO_HUNAN_CPC();
  }

  return image;
}
