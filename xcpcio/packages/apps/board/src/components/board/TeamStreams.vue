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
import type {Rank, Team} from "@xcpcio/core";

const props = defineProps<{
  rank: Rank;
  team: Team;
}>();

const rank = computed(() => props.rank);
const team = computed(() => props.team);

// Computed stream URLs with template replacement
const webcamStreamUrl = computed(() => {
  const template = rank.value.contest.options.teamWebcamStreamUrlTemplate;
  if (!template) {
    return null;
  }
  return template.replace(/\$\{team_id\}/, team.value.id);
});

const screenStreamUrl = computed(() => {
  const template = rank.value.contest.options.teamScreenStreamUrlTemplate;
  if (!template) {
    return null;
  }
  return template.replace(/\$\{team_id\}/, team.value.id);
});
</script>

<template>
  <DualStreamPlayer
    :webcam-url="webcamStreamUrl"
    :screen-url="screenStreamUrl"
  />
</template>
