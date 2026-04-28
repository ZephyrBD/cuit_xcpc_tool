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
import type {BattleOfGiants} from "@xcpcio/core";

const props = defineProps<{
  battleOfGiants: BattleOfGiants;
}>();

const battleOfGiants = computed(() => props.battleOfGiants);
</script>

<template>
  <div>
    <div
      text-8xl font-mono
      flex justify-center items-center
    >
      <div
        flex justify-end items-center
        text-blue-400
      >
        <div>
          {{ battleOfGiants.blueTeam.name }}
        </div>

        <div
          flex flex-col
          items-center justify-center
          ml-4
        >
          <div
            text-6xl
          >
            {{ battleOfGiants.blueTeam.totalSolvedProblemNum }}
          </div>

          <div
            text-4xl
          >
            {{ battleOfGiants.blueTeam.totalPenaltyToString }}
          </div>
        </div>
      </div>

      <div
        flex justify-center items-center
        ml-4 mr-4
      >
        :
      </div>

      <div
        flex justify-start items-center
        text-red-400
      >
        <div
          flex flex-col
          items-center justify-center
          mr-4
        >
          <div
            text-6xl
          >
            {{ battleOfGiants.redTeam.totalSolvedProblemNum }}
          </div>

          <div
            text-4xl
          >
            {{ battleOfGiants.redTeam.totalPenaltyToString }}
          </div>
        </div>

        <div>
          {{ battleOfGiants.redTeam.name }}
        </div>
      </div>
    </div>
  </div>
</template>
