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
import type {Contest, Submissions, Teams} from "@xcpcio/core";
import {Balloon, createContest, createSubmissions, createTeams, Rank} from "@xcpcio/core";
import type {Contest as IContest, Lang, Submissions as ISubmissions, Teams as ITeams} from "@xcpcio/types";
import {BALLOON_TITLE_SUFFIX} from "@board/composables/constant";

const props = defineProps<{
  dataSourceUrl: string;
}>();

const title = useTitle(BALLOON_TITLE_SUFFIX);
const { t, locale } = useI18n();
const lang = computed(() => locale.value as unknown as Lang);

const firstLoaded = ref(false);
const contestData = ref({} as Contest);
const teamsData = ref([] as Teams);
const submissionsData = ref([] as Submissions);
const rank = ref({} as Rank);

function reBuildBalloons() {
  const newRank = new Rank(contestData.value, teamsData.value, submissionsData.value);
  newRank.buildBalloons();
  rank.value = newRank;
}

const { data, isError, error } = useQueryBoardData(props.dataSourceUrl);
watch(data, async () => {
  if (data.value === null || data.value === undefined) {
    return;
  }

  contestData.value = createContest(data.value?.contest as IContest);
  title.value = `${contestData.value.name.getOrDefault(lang.value)} | ${BALLOON_TITLE_SUFFIX}`;

  teamsData.value = createTeams(data.value?.teams as ITeams);
  submissionsData.value = createSubmissions(data.value?.submissions as ISubmissions, contestData.value);

  reBuildBalloons();

  firstLoaded.value = true;
}, { immediate: true });

const balloons = computed(() => {
  // eslint-disable-next-line vue/no-side-effects-in-computed-properties
  return rank.value.balloons.sort(Balloon.compare).reverse().slice(0, 256);
});
</script>

<template>
  <div
    class="bg-[#323443]"
    text-gray-200
    w-screen h-screen
  >
    <div v-if="!firstLoaded">
      <div
        flex flex-col
        justify-center items-center
        w-screen h-screen
        text-xl italic
      >
        <div>
          {{ t("common.loading") }}...
        </div>

        <div v-if="isError">
          {{ error }}
        </div>
      </div>
    </div>

    <div
      v-else
    >
      <div
        flex flex-col
        justify-between
      >
        <template
          v-for="(b, index) in balloons"
          :key="b.key"
        >
          <BalloonBlock
            :index="index"
            :balloon="b"
          />
        </template>
      </div>
    </div>
  </div>
</template>
