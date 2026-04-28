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
import type {Contest} from "@xcpcio/core";
import {createContest} from "@xcpcio/core";
import type {Contest as IContest, Lang} from "@xcpcio/types";
import {ContestState} from "@xcpcio/types";

const props = defineProps<{
  dataSourceUrl: string;
}>();

const { t, locale } = useI18n();
const lang = computed(() => locale.value as unknown as Lang);
const title = useTitle(COUNTDOWN_TITLE_SUFFIX);

const now = useNow();
const contest = ref({} as Contest);
const firstLoaded = ref(false);

const { data, isError, error } = useQueryBoardData(props.dataSourceUrl);
watch(data, async () => {
  if (data.value === null || data.value === undefined) {
    return;
  }

  contest.value = createContest(data.value?.contest as IContest);
  title.value = `${contest.value.name.getOrDefault(lang.value)} | ${COUNTDOWN_TITLE_SUFFIX}`;

  firstLoaded.value = true;
}, { immediate: true });
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
        items-center justify-center
        font-mono
      >
        <div
          mt-20
          text-6xl
          :class="[contest.getContestState(now).toString()]"
        >
          {{ contest.getContestState(now) }}
        </div>

        <div
          mt-20
          class="text-[320px]"
          :class="[contest.getContestState(now).toString()]"
        >
          <div
            v-if="contest.getContestState(now) === ContestState.PENDING"
          >
            {{ contest.getContestPendingTime(now) }}
          </div>

          <div
            v-else
          >
            {{ contest.getContestElapsedTime(now) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.PENDING {
  color: #3bb4f2;
}

.RUNNING {
  color: rgb(94, 185, 94);
}

.FROZEN {
  color: #dd514c;
}

.FINISHED {
  color: #0e90d2;
}

.PAUSED {
  color: #3bb4f2;
}
</style>
