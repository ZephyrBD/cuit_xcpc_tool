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

package top.techmczs.cuitxcpctool.utils;

import cn.hutool.core.util.StrUtil;

/**
 * 代码格式化工具（支持 C/CPP/Java/Python/TXT）
 */
public class CodeFormatter {

    /**
     * 统一格式化代码
     */
    public static String formatCode(String code, String fileSuffix) {
        if (StrUtil.isBlank(code)) return "";
        // 统一换行符
        code = code.replaceAll("\\r\\n", "\n").replaceAll("\\r", "\n");

        return switch (fileSuffix.toLowerCase()) {
            case "c", "cpp", "java" -> formatCCode(code);
            case "py" -> formatPythonCode(code);
            default -> code;
        };
    }

    /**
     * C/CPP/Java 格式化（自动缩进）
     */
    private static String formatCCode(String code) {
        StringBuilder sb = new StringBuilder();
        int indent = 0;
        for (String line : code.split("\n")) {
            String trimLine = line.trim();
            if (StrUtil.isBlank(trimLine)) continue;

            // 遇到 } 减少缩进
            if (trimLine.startsWith("}")) indent = Math.max(0, indent - 1);
            // 添加缩进
            sb.repeat("  ", indent);
            sb.append(trimLine).append("\n");
            // 遇到 { 增加缩进
            if (trimLine.endsWith("{") && !trimLine.startsWith("}")) indent++;
        }
        return sb.toString();
    }

    /**
     * Python 格式化（清理空行）
     */
    private static String formatPythonCode(String code) {
        StringBuilder sb = new StringBuilder();
        for (String line : code.split("\n")) {
            if (StrUtil.isBlank(line)) continue;
            sb.append(line).append("\n");
        }
        return sb.toString();
    }
}
