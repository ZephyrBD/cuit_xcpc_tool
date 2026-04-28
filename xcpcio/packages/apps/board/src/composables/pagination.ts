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

export class Pagination {
  totalSize: number;

  currentPage: number;
  pageSize: number;

  constructor() {
    this.totalSize = 0;

    this.currentPage = 0;
    this.pageSize = 16;
  }

  get totalPage() {
    return Math.floor((this.totalSize + this.pageSize - 1) / this.pageSize);
  }

  get currentLeft() {
    return this.currentPage * this.pageSize;
  }

  get currentRight() {
    return Math.min(this.totalSize, (this.currentPage + 1) * this.pageSize);
  }

  get leftDecrPage() {
    const res = [];

    let step = 1;
    let cur = this.currentPage - step;

    while (cur > 0) {
      res.push(cur);

      step = step << 1;
      cur -= step;
    }

    return res.reverse();
  }

  get rightIncrPage() {
    const res = [];

    let step = 1;
    let cur = this.currentPage + step;

    while (cur + 1 < this.totalPage) {
      res.push(cur);

      step = step << 1;
      cur += step;
    }

    return res;
  }

  onPageChange(options: {
    to?: number;
    diff?: number;
  }) {
    const totalPage = this.totalPage;

    let to = this.currentPage;

    if (options?.to !== undefined) {
      to = options.to;
    }

    if (options?.diff !== undefined) {
      const diff = options.diff;
      to = to + diff;
    }

    if (to < 0 || to >= totalPage) {
      return;
    }

    this.currentPage = to;
  }
}
