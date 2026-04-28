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
import type {Giants, Rank, SelectOptionItem} from "@xcpcio/core";
import {GiantsType} from "@xcpcio/core";

const props = defineProps<{
  rank: Rank;
  orgOptions: SelectOptionItem[];
  teamsOptions: SelectOptionItem[];
  giants: Giants;
}>();

const emit = defineEmits([
  "update:giants",
]);

const { t } = useI18n();

const giants = computed({
  get() {
    return props.giants;
  },
  set(value) {
    emit("update:giants", value);
  },
});

const orgSelectedItems = ref<Array<SelectOptionItem>>(giants.value.filterOrganizations);
function orgOnSelect(selectedItems: Array<SelectOptionItem>, _lastSelectItem: SelectOptionItem) {
  orgSelectedItems.value = selectedItems;
  giants.value.setFilterOrganizations(selectedItems);
}

const teamsSelectedItems = ref<Array<SelectOptionItem>>(giants.value.filterTeams);
function teamsOnSelect(selectedItems: Array<SelectOptionItem>, _lastSelectItem: SelectOptionItem) {
  teamsSelectedItems.value = selectedItems;
  giants.value.setFilterTeams(selectedItems);
}

const title = computed(() => {
  return `${giants.value.type === GiantsType.BLUE ? "Blue" : "Red"} Team`;
});

const color = computed(() => {
  return giants.value.type === GiantsType.BLUE ? "#0000FF" : "#FF0000";
});
</script>

<template>
  <div
    ml-4 mt-2
  >
    <div
      flex text-sm
      :style="{
        color,
      }"
    >
      {{ title }}
    </div>

    <div
      ml-4 mt-2
      grid grid-cols-6 gap-y-4
    >
      <div
        flex items-center
        text-sm
      >
        Name:
      </div>

      <div
        flex items-center
        w-full
        col-span-5
      >
        <TheInput
          v-model="giants.name"
          text-align="left"
        />

        <Tooltip>
          <div
            i-material-symbols-refresh
            cursor-pointer btn
            text-2xl
            ml-2
            @click="giants.refreshName()"
          />

          <template #popper>
            <div>
              Refresh Name
            </div>
          </template>
        </Tooltip>
      </div>

      <div
        v-if="rank.contest.options.enableOrganization"
        flex items-center
        text-sm
      >
        {{ t("standings.organization") }}:
      </div>

      <div
        v-if="rank.contest.options.enableOrganization"
        flex items-center
        w-full
        col-span-5
      >
        <TheMultiSelect
          :options="orgOptions"
          :selected-options="orgSelectedItems"
          @select="orgOnSelect"
        />
      </div>

      <div
        text-sm
        flex items-center
      >
        Team:
      </div>

      <div
        flex items-center
        w-full
        col-span-5
      >
        <TheMultiSelect
          :options="teamsOptions"
          :selected-options="teamsSelectedItems"
          @select="teamsOnSelect"
        />
      </div>
    </div>
  </div>
</template>
