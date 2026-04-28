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

const props = defineProps<{
  rank: Rank;
}>();

const { t } = useI18n();

const route = useRoute();
const router = useRouter();
const component = useQueryForComponent();

function goResolver() {
  if (window.DATA_SOURCE) {
    component.value = "resolver";
  } else {
    router.push(`/resolver/?data-source=${route.path}`);
  }
}

function goBalloon() {
  if (window.DATA_SOURCE) {
    component.value = "balloon";
  } else {
    router.push(`/balloon/?data-source=${route.path}`);
  }
}

function goCountdown() {
  if (window.DATA_SOURCE) {
    component.value = "countdown";
  } else {
    router.push(`/countdown/?data-source=${route.path}`);
  }
}
</script>

<template>
  <div
    flex flex-col
  >
    <div>
      <div class="mb-2 text-xl font-bold">
        {{ t('utility.tools') }}
      </div>

      <div class="border-t border-gray-300 pt-4">
        <div
          w-full
          flex gap-4
        >
          <button
            btn
            title="Countdown"
            @click="goCountdown"
          >
            {{ t('type_menu.countdown') }}
          </button>

          <button
            btn
            title="Balloon"
            @click="goBalloon"
          >
            {{ t('type_menu.balloon') }}
          </button>

          <button
            btn
            title="Resolver"
            @click="goResolver"
          >
            {{ t('type_menu.resolver') }}
          </button>

          <button
            btn
            title="Submissions"
            disabled="true"
          >
            {{ t('type_menu.submissions') }}
          </button>
        </div>
      </div>
    </div>

    <div class="mt-8">
      <div class="mb-2 text-xl font-bold">
        {{ t('utility.export') }}
      </div>

      <div class="border-t border-gray-300 pt-4">
        <Export
          :rank="props.rank"
        />
      </div>
    </div>
  </div>
</template>
