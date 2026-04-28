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
const props = defineProps<{
  textAlign?: "left" | "center" | "right";
  textType?: "text" | "number";
}>();

const { modelValue } = defineModels<{
  modelValue: string | number;
}>();
</script>

<template>
  <input
    id="input"
    v-model="modelValue"
    v-bind="$attrs"
    :type="props.textType ?? 'text'"
    :text="props.textAlign ?? 'center'"
    p="x-4 y-2"
    w-full
    bg="transparent"
    border="~ rounded gray-200 dark:gray-700"
    outline="none active:none"
  >
</template>
