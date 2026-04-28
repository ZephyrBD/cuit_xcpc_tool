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

CUR_DIR="$(dirname "$(realpath "${BASH_SOURCE[0]}")")"

VERSION=$(cat <"${CUR_DIR}/../package.json" | grep version | sed 's|  \"version\": \"||g' | sed 's|\",||g')

echo "current package version: $VERSION"

export BOARD_CDN_HOST="https://cdn.jsdelivr.net/npm/@xcpcio/board-app@${VERSION}/dist"

bash "${CUR_DIR}/inject_vars_all.sh"
