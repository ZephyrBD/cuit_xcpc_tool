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
import type {Image} from "@xcpcio/types";
import {getImageSource} from "@xcpcio/core";

const props = defineProps<{
  image: Image;
  widthClass?: string;
}>();

const image = computed(() => {
  return props.image;
});

const widthClass = computed(() => {
  if (props.widthClass) {
    return props.widthClass;
  }

  return "h-8 w-8";
});
</script>

<template>
  <img
    v-if="image.base64 || image.url"
    :src="getImageSource(image, DATA_HOST)"
    alt="badge"
    :class="[widthClass]"
  >
</template>
