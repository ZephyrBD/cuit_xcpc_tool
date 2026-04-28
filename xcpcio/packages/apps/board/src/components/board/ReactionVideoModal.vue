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
import type {SubmissionReaction} from "@xcpcio/types";

const props = defineProps<{
  isOpen: boolean;
  submissionReaction: SubmissionReaction;
  width?: string;
}>();

const emit = defineEmits(["close"]);

const videoPlayer = ref<HTMLVideoElement | null>(null);

function closeModal() {
  emit("close");
}

function closeModalOnBackgroundClick(event: MouseEvent) {
  if (event.target === event.currentTarget) {
    closeModal();
  }
}

watch(() => props.isOpen, (newValue) => {
  if (newValue && videoPlayer.value) {
    videoPlayer.value.play();
  } else if (videoPlayer.value) {
    videoPlayer.value.pause();
    videoPlayer.value.currentTime = 0;
  }
});
</script>

<template>
  <div
    v-if="isOpen"
    fixed inset-0 flex items-center justify-center
    p-2 bg-black bg-opacity-50
    z-2999
    @click="closeModalOnBackgroundClick"
  >
    <div
      bg-white
      shadow
      relative overflow-hidden
      class="h-[100%]"
      :class="[width ?? 'w-[540px]']"
      @click.stop
    >
      <video
        ref="videoPlayer"
        controls autoplay
        class="w-full h-full"
      >
        <source
          :src="submissionReaction.url"
          type="video/mp4"
        >
        Your browser does not support the video tag.
      </video>
      <div
        absolute top-0.5 right-0.5
        text-black
        rounded-md p-2 transition-colors duration-300 focus:outline-none
        cursor-pointer
        @click="closeModal"
      >
        <span
          i-ion-close-circle-outline
          text-2xl
        />
      </div>
    </div>
  </div>
</template>
