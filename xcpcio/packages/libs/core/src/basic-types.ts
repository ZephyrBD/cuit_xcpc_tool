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

import type {I18NStringSet, Lang, Text as IText} from "@xcpcio/types";

export interface SelectOptionItem {
  value: string;
  text: string;
}

export class I18nText {
  texts: Map<Lang, string>;
  fallback?: string;
  fallbackLang?: Lang;

  constructor() {
    this.texts = new Map<Lang, string>();
  }

  get(lang: Lang): string | undefined {
    return this.texts.get(lang);
  }

  getOrDefault(lang?: Lang): string {
    return (lang ? this.texts.get(lang) : undefined) || (this.fallbackLang ? this.texts.get(this.fallbackLang) : undefined) || this.fallback || "";
  }

  set(lang: Lang, text: string): void {
    this.texts.set(lang, text);
  }

  has(lang: Lang): boolean {
    return this.texts.has(lang);
  }

  static fromI18NStringSet(stringSet: I18NStringSet): I18nText {
    const i18nText = new I18nText();
    i18nText.fallback = stringSet.fallback;
    i18nText.fallbackLang = stringSet.fallback_lang;
    if (stringSet.texts) {
      for (const [lang, text] of Object.entries(stringSet.texts)) {
        i18nText.set(lang as Lang, text);
      }
    }
    return i18nText;
  }

  static fromIText(text: IText): I18nText {
    if (typeof text === "string") {
      const i18nText = new I18nText();
      i18nText.fallback = text;
      return i18nText;
    }
    return I18nText.fromI18NStringSet(text);
  }

  toI18NStringSet(): I18NStringSet {
    const result: I18NStringSet = {};

    if (this.fallback !== undefined) {
      result.fallback = this.fallback;
    }

    if (this.fallbackLang !== undefined) {
      result.fallback_lang = this.fallbackLang;
    }

    if (this.texts.size > 0) {
      result.texts = {};
      for (const [lang, text] of this.texts.entries()) {
        result.texts[lang] = text;
      }
    }

    return result;
  }

  valueOf(): string {
    return this.getOrDefault();
  }
}
