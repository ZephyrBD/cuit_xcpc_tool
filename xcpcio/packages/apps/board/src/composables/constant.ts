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

export const APP_VERSION = __APP_VERSION__;
export const GITHUB_URL = __GITHUB_URL__;
export const GITHUB_SHA = __GITHUB_SHA__;
export const XCPCIO_HOME = __XCPCIO_HOME__;

export const TITLE_SUFFIX = "Board - XCPCIO";
export const RATING_TITLE_SUFFIX = "Rating - XCPCIO";
export const BALLOON_TITLE_SUFFIX = "Balloon - XCPCIO";
export const RESOLVER_TITLE_SUFFIX = "Resolver - XCPCIO";
export const COUNTDOWN_TITLE_SUFFIX = "Countdown - XCPCIO";
export const SUBMISSION_TITLE_SUFFIX = "Submission - XCPCIO";

export const CDN_HOST = computed(() => {
  if (!window) {
    return "";
  }

  return window.CDN_HOST;
});

export const DATA_HOST = computed(() => {
  if (!window) {
    return "";
  }

  return window.DATA_HOST;
});

export const RATING_DATA_HOST = computed(() => {
  const dataHost = DATA_HOST.value;
  return dataHost.replace("/data/", "/rating-data/");
});

export const DATA_REGION = computed(() => {
  if (!window) {
    return "";
  }

  return window.DATA_REGION;
});
