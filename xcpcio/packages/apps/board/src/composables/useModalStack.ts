/*
 * Copyright (C) 2018-2026 Modding Craft ZBD Studio.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */

import {ref} from "vue";

const modalStack = ref<symbol[]>([]);

export function useModalStack() {
  const id = Symbol("modal");

  function register() {
    modalStack.value.push(id);
  }

  function unregister() {
    const index = modalStack.value.indexOf(id);
    if (index > -1) {
      modalStack.value.splice(index, 1);
    }
  }

  function isTopModal() {
    return modalStack.value[modalStack.value.length - 1] === id;
  }

  function isAnyModalOpen() {
    return modalStack.value.length > 0;
  }

  return { register, unregister, isTopModal, isAnyModalOpen };
}
