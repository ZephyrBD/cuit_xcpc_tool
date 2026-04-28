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

import antfu from "@antfu/eslint-config";

export default antfu(
  {
    vue: true,
    yaml: true,
    unocss: true,
    formatters: true,
    pnpm: true,
    typescript: true,
    stylistic: {
      indent: 2,
      quotes: "double",
      semi: true,
    },
    ignores: [
      "dist/**/*",
      "cache/**/*",
      "node_modules/**/*",
      "packages/apps/board/.vite-ssg-temp/**/*",

      "data/**/*",
      "**/test-data/**/*",

      "python/**/*",
      ".pytest_cache/**/*",

      "*.html",
    ],
  },
  {
    rules: {
      "curly": ["error", "all"],
      "no-lone-blocks": "off",
      "style/brace-style": ["error", "1tbs"],
      "unocss/order": "off",
      "unocss/order-attributify": "off",
    },
  },
);
