#!/bin/bash

#
# Copyright (C) 2018-2026 Modding Craft ZBD Studio.
#
# This program is free software; you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation; either version 2 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License along
# with this program; if not, write to the Free Software Foundation, Inc.,
# 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
#

TARGET_FILE="${1}"

CDN_HOST=""

if [[ -n "${BOARD_CDN_HOST}" ]]; then
  CDN_HOST="${BOARD_CDN_HOST}"
fi

BASE_URL="${BOARD_BASE_URL}"
DATA_HOST="${BOARD_DATA_HOST}"
DATA_REGION="${BOARD_DATA_REGION}"
DEFAULT_LANG="${BOARD_DEFAULT_LANG}"
REFETCH_INTERVAL="${BOARD_REFETCH_INTERVAL}"
BAIDU_ANALYTICS_ID="${BOARD_BAIDU_ANALYTICS_ID}"
UMAMI_JS_URL="${BOARD_UMAMI_JS_URL}"
UMAMI_WEBSITE_ID="${BOARD_UMAMI_WEBSITE_ID}"

sed -i "s|__CDN_HOST__|${CDN_HOST}|g" "${TARGET_FILE}"

if [[ -n "${BASE_URL}" ]]; then
  sed -i "s|__BASE_URL__|\"${BASE_URL}\"|g" "${TARGET_FILE}"
fi

if [[ -n "${DATA_HOST}" ]]; then
  sed -i "s|__DATA_HOST__|\"${DATA_HOST}\"|g" "${TARGET_FILE}"
fi

if [[ -n "${DATA_REGION}" ]]; then
  sed -i "s|__DATA_REGION__|\"${DATA_REGION}\"|g" "${TARGET_FILE}"
fi

if [[ -n "${DEFAULT_LANG}" ]]; then
  sed -i "s|__DEFAULT_LANG__|\"${DEFAULT_LANG}\"|g" "${TARGET_FILE}"
fi

if [[ -n "${REFETCH_INTERVAL}" ]]; then
  sed -i "s|__REFETCH_INTERVAL__|\"${REFETCH_INTERVAL}\"|g" "${TARGET_FILE}"
fi

if [[ -n "${BAIDU_ANALYTICS_ID}" ]]; then
  sed -i "s|__BAIDU_ANALYTICS_ID__|\"${BAIDU_ANALYTICS_ID}\"|g" "${TARGET_FILE}"
fi

if [[ -n "${UMAMI_JS_URL}" ]]; then
  sed -i "s|__UMAMI_JS_URL__|\"${UMAMI_JS_URL}\"|g" "${TARGET_FILE}"
fi

if [[ -n "${UMAMI_WEBSITE_ID}" ]]; then
  sed -i "s|__UMAMI_WEBSITE_ID__|\"${UMAMI_WEBSITE_ID}\"|g" "${TARGET_FILE}"
fi
