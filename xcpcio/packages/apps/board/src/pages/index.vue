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
import type {ContestIndexList} from "@xcpcio/core";
import {createContestIndexList} from "@xcpcio/core";
import type {Lang} from "@xcpcio/types";

import ContestIndexUI from "@board/components/ContestIndexUI.vue";
import SearchInput from "@board/components/SearchInput.vue";
import {TITLE_SUFFIX} from "@board/composables/constant";

import {useFetch} from "@vueuse/core";

const { t, locale } = useI18n();
const lang = computed(() => locale.value as unknown as Lang);

useTitle(TITLE_SUFFIX);

const FETCH_INTERVAL = 1000 * 60 * 5;
const now = useNow();
const nowMinutes = computed(() => Math.floor(now.value.getTime() / FETCH_INTERVAL));

function genURL() {
  return `${window.DATA_HOST}index/contest_list.json?t=${nowMinutes.value}`;
}
const url = ref(genURL());

const s = useQueryForSearch();
const searchText = ref<string | null>(s.value);
const searchInputRef = ref<InstanceType<typeof SearchInput> | null>(null);

const contestIndexAllList = ref([] as ContestIndexList);
const contestIndexList = ref([] as ContestIndexList);

function onSearch() {
  contestIndexList.value = contestIndexAllList.value.filter((c) => {
    if (searchText.value?.length === 0) {
      searchText.value = null;
    }

    if (searchText.value === null) {
      s.value = undefined as unknown as string;
      return true;
    }

    s.value = searchText.value;

    if (c.contest.name.getOrDefault(lang.value).includes(searchText.value)
      || c.contest.name.getOrDefault(lang.value).toLowerCase().includes(searchText.value.toLowerCase())
      || c.boardLink.toLocaleLowerCase().includes(searchText.value.toLowerCase())) {
      return true;
    }

    return false;
  });
}

function clearSearch() {
  searchText.value = null;
  searchInputRef.value?.focus();
}

const {
  error,
  isFetching,
  isFinished,
} = useFetch(url, {
  refetch: true,
  afterFetch: (ctx) => {
    contestIndexAllList.value = createContestIndexList(JSON.parse(ctx.data));
    contestIndexList.value = contestIndexAllList.value.map(c => c);
    onSearch();

    return ctx;
  },
}).get();

watch(searchText, () => {
  onSearch();
});

const fetchIntervalId = setInterval(() => {
  url.value = genURL();
}, FETCH_INTERVAL);

onUnmounted(() => {
  clearInterval(fetchIntervalId);
});
</script>

<template>
  <div
    class="sm:w-[1024px] lg:w-screen"
    lg:of-x-hidden
    flex flex-col justify-center items-center
  >
    <div>
      <div
        v-if="isFetching || error"
        mt-4 mb-4
        class="sm:w-[1000px] lg:w-screen"
        flex justify-center items-center
      >
        <div
          v-if="isFetching"
        >
          {{ t("common.loading") }}...
        </div>

        <div
          v-if="error"
        >
          {{ error }}
        </div>
      </div>

      <div
        v-if="isFinished"
        class="sm:w-[1000px] lg:w-screen min-h-120"
        flex flex-col items-center
      >
        <div w-240>
          <SearchInput
            ref="searchInputRef"
            v-model="searchText"
          />
        </div>

        <div
          v-if="contestIndexList.length"
          mt-4
        >
          <template
            v-for="item in contestIndexList"
            :key="item.boardLink"
          >
            <ContestIndexUI
              :data="item"
            />
          </template>
        </div>

        <div v-else p10>
          <div op40 italic mb5>
            No result found
          </div>
          <div row justify-center>
            <button
              btn
              @click="clearSearch()"
            >
              Clear search
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: index-layout
</route>
