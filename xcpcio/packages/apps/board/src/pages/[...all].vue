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
const { t } = useI18n();
const route = useRoute();

const contestTypes = [
  "camp",
  "icpc",
  "ccpc",
  "provincial-contest",
];

const isNotFound = !contestTypes.some(c => route.fullPath.startsWith(`/${c}`));
const component = useQueryForComponent();
const dataSource = window.DATA_SOURCE;
</script>

<template>
  <div v-if="dataSource">
    <Board v-if="component === 'board'" :data-source-url="dataSource" />
    <Resolver v-else-if="component === 'resolver'" :data-source-url="dataSource" />
    <Balloon v-else-if="component === 'balloon'" :data-source-url="dataSource" />
    <Countdown v-else-if="component === 'countdown'" :data-source-url="dataSource" />
  </div>
  <div v-else-if="isNotFound" class="flex flex-col items-center">
    <div text-4xl>
      <div i-carbon-warning />
    </div>
    {{ t('not-found') }}
    <GoBack />
  </div>

  <div v-else>
    <Board />
  </div>
</template>

<route lang="yaml">
meta:
  layout: board-layout
</route>
