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
const { t } = useI18n();

const dataSourceUrl = useQueryForDataSourceUrl();
const dataSourceUrlText = "Data Source URL";
const dataSourceUrlInput = ref(dataSourceUrl.value);

const route = useRoute();
const router = useRouter();
function go() {
  router.push(`${route.fullPath}/?data-source=${dataSourceUrlInput.value.trim()}`);
}
</script>

<template>
  <div
    v-if="dataSourceUrl.length === 0"
    class="flex flex-col items-center"
  >
    <div
      w-128
    >
      <TheInput
        v-model="dataSourceUrlInput"
        w-full
        :placeholder="dataSourceUrlText"
        autocomplete="false"
        @keydown.enter="go"
      />
      <label class="hidden" for="input">
        {{ dataSourceUrlText }}
      </label>
    </div>

    <div py-2 />

    <div>
      <button
        m-3 text-sm btn
        :disabled="dataSourceUrlInput.length === 0"
        @click="go"
      >
        {{ t('button.go') }}
      </button>
    </div>
  </div>
</template>
