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
import type {Problem, Rank} from "@xcpcio/core";

const props = defineProps<{
  rank: Rank;
  problem: Problem;
}>();

const hiddenModal = ref(true);
function onClick() {
  hiddenModal.value = false;
}

const rank = computed(() => props.rank);
const problem = computed(() => props.problem);

const balloonColor = computed(() => problem.value.balloonColor);
</script>

<template>
  <th
    :key="problem.id"
    class="success"
    text-center
    style="width: 3rem;"
    :style="{
      'background-color': balloonColor.background_color,
      'color': balloonColor.color,
    }"
  >
    <div
      cursor-pointer
      flex flex-col
      justify-center items-center
      @click="onClick"
    >
      <div>
        {{ problem.label }}
      </div>
      <div>
        {{ problem.statistics.acceptedNum }}
      </div>
    </div>

    <div>
      <ProblemInfoModal
        v-if="!hiddenModal"
        v-model:is-hidden="hiddenModal"
        :rank="rank"
        :problem="problem"
      />
    </div>
  </th>
</template>

<style scoped lang="less">
@import "./Standings.less";
</style>
