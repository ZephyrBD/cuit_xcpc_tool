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
const { modelValue } = defineModels<{
  modelValue: string | null;
}>();

const inputEl = $ref<HTMLInputElement>();
const vFocus = {
  mounted: (el: HTMLElement) => el.focus(),
};

function clear() {
  modelValue.value = null;
  inputEl?.focus();
}

function focus() {
  inputEl?.focus();
}

defineExpose({ focus });
</script>

<template>
  <div relative>
    <input
      ref="inputEl"
      v-model="modelValue"
      v-focus
      type="text"
      v-bind="$attrs"
      p="x-4 y-2"
      text="left"
      bg="transparent"
      autocomplete="off"
      w="full"
      border="~ rounded gray-300 dark:gray-500"
      outline="none active:none"
      aria-label="Search"
      placeholder="Search..."
    >
    <button
      v-if="modelValue?.length"
      absolute flex right-2 w-10 top-2 bottom-2 text-xl op30 hover:op90
      aria-label="Clear search"
      @click="clear()"
    >
      <span
        i-carbon-close
        ma
        block
        aria-hidden="true"
      />
    </button>
  </div>
</template>
