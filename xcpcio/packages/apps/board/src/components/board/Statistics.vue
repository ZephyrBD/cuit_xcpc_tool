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
import type {Rank} from "@xcpcio/core";

import {Chart} from "highcharts-vue";

const props = defineProps<{
  rank: Rank;
}>();

const { t } = useI18n();

const rank = computed(() => props.rank);

const headData = computed(() => {
  const res = [];

  res.push({
    title: "standings.statistics.head_data.problems",
    data: rank.value.contest.problems.length,
  });

  if (rank.value.organizations.length > 0) {
    res.push({
      title: "standings.statistics.head_data.organizations",
      data: rank.value.organizations.length,
    });
  }

  res.push({
    title: "standings.statistics.head_data.teams",
    data: rank.value.teams.length,
  });

  res.push({
    title: "standings.statistics.head_data.submissions",
    data: rank.value.getSubmissions().length,
  });

  return res;
});

const headDataGap = computed(() => {
  if (headData.value.length === 4) {
    return "gap-20";
  }

  return "gap-32";
});
</script>

<template>
  <div
    class="w-full"
    flex flex-col
  >
    <section>
      <div
        class="sm:w-full md:w-[92%]"
        mx-auto px-4 py-4 lg:px-6 lg:py-6
      >
        <div
          flex flex-nowrap justify-center items-center
          :class="headDataGap"
        >
          <div v-for="h in headData" :key="h.title" class="w-[16rem]">
            <div
              w-full
              p-6 xl:p-8
              flex flex-col
              border border-gray-100 dark:border-gray-600
              text-center test-gray-900
              bg-white dark:bg-gray-800
              dark:text-white
              shadow rounded-md
            >
              <h3
                mb-4 text-2xl font-semibold
              >
                {{ t(h.title) }}
              </h3>
              <div class="my-8 flex items-baseline justify-center">
                <span class="mr-2 text-5xl font-extrabold">{{ h.data }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div
      mt-8 gap-8
      flex flex-col
    >
      <div>
        <SubmitHeatMap
          :rank="rank"
        />
      </div>

      <div>
        <Chart
          :options="getSubmitChart(rank)"
        />
      </div>

      <div>
        <Chart
          :options="getProblemChart(rank)"
        />
      </div>

      <div>
        <Chart
          :options="getTeamChart(rank)"
        />
      </div>
    </div>
  </div>
</template>
