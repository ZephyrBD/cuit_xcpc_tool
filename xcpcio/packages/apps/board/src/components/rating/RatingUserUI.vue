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
import type {RatingUser} from "@xcpcio/core";
import {RatingUtility} from "@xcpcio/core";
import type {Lang} from "@xcpcio/types";

import "./rating.less";

const props = defineProps<{
  ix: number;
  ratingUser: RatingUser;
}>();

const u = computed(() => props.ratingUser);
const { locale } = useI18n();
const lang = computed(() => locale.value as unknown as Lang);

const hiddenRatingInfoModal = ref(true);
function onClickRatingInfoModal() {
  hiddenRatingInfoModal.value = false;
}
</script>

<template>
  <tr
    class="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
  >
    <td
      class="whitespace-nowrap px-4 py-2 text-gray-900 dark:text-white"
    >
      {{ u.organization }}
    </td>
    <td>
      <div
        class="whitespace-nowrap px-4 py-2 text-gray-900 dark:text-white"
        cursor-pointer
        :class="RatingUtility.getRatingLevelClass(u.rating)"
        @click="onClickRatingInfoModal"
      >
        {{ u.name.getOrDefault(lang) }}
      </div>

      <div>
        <RatingInfoModal
          v-if="!hiddenRatingInfoModal"
          v-model:is-hidden="hiddenRatingInfoModal"
          :rating-user="u"
        />
      </div>
    </td>
    <td
      class="whitespace-nowrap px-4 py-2 text-gray-900 dark:text-white"
    >
      {{ u.members.map(m => m.name.getOrDefault(lang).trim()).join(" ") }}
    </td>
    <td
      class="whitespace-nowrap px-4 py-2 text-gray-900 dark:text-white"
    >
      <RatingBadge
        :rating="u.rating"
      />
    </td>
    <td
      class="whitespace-nowrap px-4 py-2 text-gray-900 dark:text-white"
    >
      <RatingBadge
        :rating="u.maxRating"
      />
    </td>
    <td
      class="whitespace-nowrap px-4 py-2 text-gray-900 dark:text-white"
    >
      <RatingBadge
        :rating="u.minRating"
      />
    </td>
  </tr>
</template>
