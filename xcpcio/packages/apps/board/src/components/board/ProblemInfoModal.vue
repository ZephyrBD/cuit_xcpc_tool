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
import type {Problem, Rank} from "@xcpcio/core";
import type {Lang} from "@xcpcio/types";

const props = defineProps<{
  isHidden: boolean;

  rank: Rank;
  problem: Problem;
}>();

const emit = defineEmits(["update:isHidden"]);

const { locale } = useI18n();
const lang = computed(() => locale.value as unknown as Lang);

const isHidden = computed({
  get() {
    return props.isHidden;
  },
  set(value) {
    emit("update:isHidden", value);
  },
});

const currentType = ref("submissions");

const rank = computed(() => props.rank);
const problem = computed(() => props.problem);

const headerTitle = computed(() => {
  let title = `Problem ${problem.value.label}`;
  if (problem.value.name) {
    title += ` - ${problem.value.name.getOrDefault(lang.value)}`;
  }
  return title;
});

const submissions = computed(() => {
  return rank.value.getSubmissions().filter(s => s.problemId === problem.value.id);
});

const TYPE_SUBMISSIONS = "submissions";
const TYPE_STATISTICS = "statistics";
const types = [TYPE_SUBMISSIONS, TYPE_STATISTICS];
</script>

<template>
  <Modal
    v-model:is-hidden="isHidden"
  >
    <template #header>
      <div
        w-full max-w-screen-xl
        px-4 mx-auto lg:px-12
      >
        <div
          relative overflow-hidden
          bg-white dark:bg-gray-800
        >
          <div
            flex flex-col items-center justify-between
            md:flex-row
            space-y-3 md:space-y-0
          >
            <div
              flex flex-row
              space-x-3
            >
              <h3
                text-gray-900 dark:text-white
                text-2xl
                font-sans font-semibold italic
              >
                {{ headerTitle }}
              </h3>
            </div>

            <ModalMenu
              v-model:current-type="currentType"
              :types="types"
            />
          </div>
        </div>
      </div>
    </template>

    <div
      w-full
      font-bold font-mono
      flex items-center justify-center
    >
      <div
        v-if="currentType === TYPE_SUBMISSIONS"
        w-full
        class="mt-[-12px]"
      >
        <SubmissionsTable
          w-full
          :rank="rank"
          :submissions="submissions"
          :page-size="8"
          :remove-border="true"
          :enable-filter="{
            organization: true,
            team: true,
            language: true,
            status: true,
          }"
        />
      </div>

      <div
        v-if="currentType === TYPE_STATISTICS"
        w-full
      />
    </div>
  </Modal>
</template>
