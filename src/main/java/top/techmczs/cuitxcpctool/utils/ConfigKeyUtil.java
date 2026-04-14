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

import org.springframework.boot.context.properties.ConfigurationProperties;
import top.techmczs.cuitxcpctool.common.RequiredConfig;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;

public class ConfigKeyUtil {

    // 支持 多个配置类 自动合并
    public static String[] getRequiredConfigKeys(Class<?>... propertiesClasses) {
        List<String> allKeys = new ArrayList<>();

        // 遍历所有配置类
        for (Class<?> clazz : propertiesClasses) {
            // 获取前缀
            ConfigurationProperties annotation = clazz.getAnnotation(ConfigurationProperties.class);
            if (annotation == null) continue;
            String prefix = annotation.prefix() + ".";

            // 遍历必填字段
            for (Field field : clazz.getDeclaredFields()) {
                if (field.isAnnotationPresent(RequiredConfig.class)) {
                    String key = prefix + camelToKebab(field.getName());
                    allKeys.add(key);
                }
            }
        }

        return allKeys.toArray(new String[0]);
    }

    // 驼峰命名 转 短横线命名
    private static String camelToKebab(String camel) {
        StringBuilder sb = new StringBuilder();
        for (char c : camel.toCharArray()) {
            if (Character.isUpperCase(c)) {
                sb.append('-');
                sb.append(Character.toLowerCase(c));
            } else {
                sb.append(c);
            }
        }
        return sb.toString();
    }
}
