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

import type {UserModule} from "./types";
import {VueQueryPlugin} from "@tanstack/vue-query";

import FloatingVue from "floating-vue";

import {setupLayouts} from "virtual:generated-layouts";
import {ViteSSG} from "vite-ssg";
import {routes} from "vue-router/auto-routes";
import {createWebHashHistory} from "vue-router";
import App from "./App.vue";

import "floating-vue/dist/style.css";
import "vue-search-select/dist/VueSearchSelect.css";
import "./styles/vue-search-select-dark.css";

import "@unocss/reset/tailwind.css";
import "@unocss/reset/tailwind-compat.css";
import "uno.css";

import "./styles/main.css";

// 修复 Edge 下窗口无法最小化的问题
window.addEventListener("mousedown", (e) => {
    if (e.clientY <= 40) {
        e.preventDefault = () => {};
    }
}, true);

// https://github.com/antfu/vite-ssg
export const createApp = ViteSSG(
    App,
    {
        routes: setupLayouts(routes),
        base: window.BASE_URL ?? import.meta.env.BASE_URL,
        history: createWebHashHistory(window.BASE_URL ?? import.meta.env.BASE_URL),
    },
    (ctx) => {
        Object.values(import.meta.glob<{ install: UserModule }>("./modules/*.ts", { eager: true }))
            .forEach(i => i.install?.(ctx));

        ctx.app.use(FloatingVue);
        ctx.app.use(VueQueryPlugin);
    },
);