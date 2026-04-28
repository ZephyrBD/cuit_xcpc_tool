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
import type {Lang} from "@xcpcio/types";
import {useFetch} from "@vueuse/core";
import {Rating} from "@xcpcio/core";

const props = defineProps<{
  id: string;
}>();

const id = computed(() => props.id);

function genURL() {
  return `${RATING_DATA_HOST.value}${id.value}/rating.json`;
}
const url = ref(genURL());
const rating = ref({} as Rating);

const { t, locale } = useI18n();
const lang = computed(() => locale.value as unknown as Lang);

useTitle(RATING_TITLE_SUFFIX);

const {
  error,
  isFetching,
  isFinished,
} = useFetch(url, {
  refetch: true,
  afterFetch: (ctx) => {
    rating.value = Rating.fromJSON(ctx.data);
    useTitle(`${rating.value.name} | ${RATING_TITLE_SUFFIX}`);
    return ctx;
  },
}).get();
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
        flex flex-col justify-center items-center
      >
        <div
          text-4xl
          font-medium font-serif
        >
          {{ rating.name.getOrDefault(lang) }}
        </div>

        <div
          mt-4
        >
          <RatingTable
            :rating="rating"
            :remove-border="true"
          />
        </div>
      </div>
    </div>
  </div>
</template>
