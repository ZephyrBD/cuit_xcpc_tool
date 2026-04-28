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
import type {Rank, Team, TeamProblemStatistics} from "@xcpcio/core";

const props = defineProps<{
  rank: Rank;
  team: Team;
  p: TeamProblemStatistics;
}>();

const hiddenModal = ref(true);
function onClick() {
  hiddenModal.value = false;
}

const rank = computed(() => props.rank);
const team = computed(() => props.team);
const p = computed(() => props.p);

function getProblemSign(p: TeamProblemStatistics): string {
  if (p.isSolved) {
    return "+";
  }

  if (p.isWrongAnswer) {
    return "-";
  }

  if (p.isPending) {
    return `? ${p.pendingCount}`;
  }

  return "";
}

function getProblemShow(p: TeamProblemStatistics): string {
  let res = "";

  if (!p.isUnSubmitted) {
    res += `${p.failedCount + Number(p.isSolved)}`;
  }

  if ((p.isSolved && rank.value.contest.statusTimeDisplay.correct)
    || (p.isPending && rank.value.contest.statusTimeDisplay.pending)
    || (p.isWrongAnswer && rank.value.contest.statusTimeDisplay.incorrect)) {
    res += `/${Math.floor(p.lastSubmitTimestamp / 60)}`;
  }

  return res;
}

function getProblemColorClass(p: TeamProblemStatistics): string {
  if (p.isFirstSolved) {
    return "first-solve";
  }

  if (p.isSolved) {
    return "correct";
  }

  if (p.isWrongAnswer) {
    return "incorrect";
  }

  if (p.isPending) {
    return "pending";
  }

  return "unattempted";
}
</script>

<template>
  <td
    class="stnd"
    :class="[getProblemColorClass(p)]"
  >
    <div
      cursor-pointer
      flex flex-col
      justify-center items-center
      @click="onClick"
    >
      <div>
        {{ getProblemSign(p) }}
      </div>
      <div>
        {{ getProblemShow(p) }}
      </div>
    </div>

    <div>
      <SubmissionsTableModal
        v-if="!hiddenModal"
        v-model:is-hidden="hiddenModal"
        :rank="rank"
        :team="team"
        :p="p"
      />
    </div>
  </td>
</template>

<style scoped lang="less">
@import "./Standings.less";
</style>
