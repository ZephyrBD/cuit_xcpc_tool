<!--
  - Copyright (C) 2018-2026 Modding Craft ZBD Studio.
  -
  - This program is free software; you can redistribute it and/or modify
  - it under the terms of the GNU General Public License as published by
  - the Free Software Foundation; either version 2 of the License, or
  - (at your option) any later version.
  -
  - This program is distributed in the hope that it will be useful,
  - but WITHOUT ANY WARRANTY; without even the implied warranty of
  - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  - GNU General Public License for more details.
  -
  - You should have received a copy of the GNU General Public License along
  - with this program; if not, write to the Free Software Foundation, Inc.,
  - 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
  -->

<script setup lang="ts">
</script>
<template>
  <footer
    mt-8
    py-4 md:py-8 lg:py-10
    w-full
    flex justify-center items-center
  >
    <div
      text-center
      w-full
    >
      <RouterLink
        flex items-center justify-center
        text-2xl font-semibold text-gray-900 dark:text-white
        to="/"
      >
        <div
          i-ion-balloon-sharp
          mr-4 h-8
        />
        Get more balloons
      </RouterLink>

      <p
        my-6 text-gray-500 dark:text-gray-400
        w-full
        flex justify-center
      >
        The ICPC Series Competition Leaderboard Visualization Engine.
      </p>

      <ul
        mb-6
        w-full
        flex flex-wrap items-center justify-center
        text-gray-900 dark:text-white
      >
        <li>
          <RouterLink
            to="/"
            mr-4 md:mr-6 hover:underline
          >
            Home
          </RouterLink>
        </li>

        <li>
          <div
            mr-4 md:mr-6
          >
            <Tooltip>
              <a
                :href="GITHUB_URL"
                hover:underline
                rel="noreferrer"
                target="_blank"
                title="GitHub"
              >
                GitHub
              </a>

              <template #popper>
                <div
                  flex justify-center items-start
                  flex-col
                >
                  <div>Tag: {{ APP_VERSION }}</div>
                  <div>Sha: {{ GITHUB_SHA }}</div>
                </div>
              </template>
            </Tooltip>
          </div>
        </li>

        <li>
          <div
            mr-4 md:mr-6
          >
            <Tooltip>
              <a
                href="mailto:hi@dup4.com"
                hover:underline
              >
                Contact
              </a>

              <template #popper>
                <div
                  flex justify-center items-start
                  flex-col
                >
                  <div>CDN Host: {{ CDN_HOST }}</div>
                  <div>DATA Host: {{ DATA_HOST }}</div>
                  <div>Data Region: {{ DATA_REGION }}</div>
                </div>
              </template>
            </Tooltip>
          </div>
        </li>
      </ul>

      <span
        text-sm text-gray-500 sm:text-center dark:text-gray-400
        w-full
      >© 2020-PRESENT <RouterLink
        to="/"
        hover:underline
      >XCPCIO™</RouterLink>. All Rights Reserved.</span>
      <span text-sm text-gray-500 sm:text-center dark:text-gray-400 w-full>
        <br> <a href="https://github.com/ZephyrBD/cuit_xcpc_tool" hover:underline>CUIT XCPC TOOL</a> embeds the xcpcio board under the MIT license, and the data is provided by CUIT XCPC TOOL.
      </span>
    </div>
  </footer>
</template>
