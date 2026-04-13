import path from "node:path";
import process from "node:process";
import VueI18n from "@intlify/unplugin-vue-i18n/vite";
import Shiki from "@shikijs/markdown-it";
import { unheadVueComposablesImports } from "@unhead/vue";
import Vue from "@vitejs/plugin-vue";
import getGitRepoInfo from "git-repo-info";
import LinkAttributes from "markdown-it-link-attributes";
import Unocss from "unocss/vite";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import VueMacros from "unplugin-vue-macros/vite";

import Markdown from "unplugin-vue-markdown/vite";
import { VueRouterAutoImports } from "unplugin-vue-router";
import VueRouter from "unplugin-vue-router/vite";
import { defineConfig } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";
import VueDevTools from "vite-plugin-vue-devtools";
import Layouts from "vite-plugin-vue-layouts";
import WebfontDownload from "vite-plugin-webfont-dl";
import generateSitemap from "vite-ssg-sitemap";
import { alias } from "../../../alias";
import { homepage, version } from "./package.json";
import "vitest/config";

const gitRepoInfo = getGitRepoInfo();

const proxyConfig = {
  target: process.env.PROXY_TARGET || "http://localhost:8080/cxtool/public/board/",
  changeOrigin: true,
};

export default defineConfig({
  resolve: {
    alias,
  },

  base: "/cxtool/board/",

  build: {
    outDir: "../../../../src/main/resources/static/board",
    emptyOutDir: true,
  },

  define: {
    __APP_VERSION__: JSON.stringify(version),
    __GITHUB_URL__: JSON.stringify("https://github.com/xcpcio/xcpcio"),
    __GITHUB_SHA__: JSON.stringify(gitRepoInfo.abbreviatedSha),
    __XCPCIO_HOME__: JSON.stringify(homepage),
  },

  plugins: [
    VueRouter({
      extensions: [".vue", ".md"],
      dts: "src/typed-router.d.ts",
    }),

    VueMacros({
      plugins: {
        vue: Vue({
          include: [/\.vue$/, /\.md$/],
        }),
      },
    }),

    Layouts(),

    AutoImport({
      include: [/\.[jt]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
      imports: [
        "vue",
        "vue-i18n",
        "@vueuse/core",
        unheadVueComposablesImports,
        VueRouterAutoImports,
        {
          "vue-router/auto": ["useLink"],
        },
      ],
      dts: "src/auto-imports.d.ts",
      dirs: [
        "src/composables",
        "src/stores",
      ],
      vueTemplate: true,
    }),

    Components({
      extensions: ["vue", "md"],
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      dts: "src/components.d.ts",
    }),

    Unocss(),

    Markdown({
      wrapperClasses: "prose prose-sm m-auto text-left",
      headEnabled: true,
      async markdownItSetup(md) {
        md.use(LinkAttributes, {
          matcher: (link: string) => /^https?:\/\//.test(link),
          attrs: {
            target: "_blank",
            rel: "noopener",
          },
        });
        md.use(await Shiki({
          defaultColor: false,
          themes: {
            light: "vitesse-light",
            dark: "vitesse-dark",
          },
        }));
      },
    }),

    VueI18n({
      runtimeOnly: true,
      compositionOnly: true,
      fullInstall: true,
      include: [path.resolve(__dirname, "locales/**")],
    }),

    VueDevTools(),

    WebfontDownload(),

    createHtmlPlugin({
      minify: {
        collapseWhitespace: true,
        keepClosingSlash: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
        minifyCSS: true,
        minifyJS: true,
      },
    }),
  ],

  test: {
    include: ["test/**/*.test.ts"],
    environment: "jsdom",
  },

  ssgOptions: {
    script: "async",
    formatting: "minify",
    beastiesOptions: {
      reduceInlineStyles: false,
    },
    onFinished() {
      generateSitemap();
    },
  },

  ssr: {
    noExternal: [/vue-i18n/],
  },

  server: {
    host: true,
    proxy: {
      "/data": proxyConfig,
      "/rating-data": proxyConfig,
    },
  },
});
