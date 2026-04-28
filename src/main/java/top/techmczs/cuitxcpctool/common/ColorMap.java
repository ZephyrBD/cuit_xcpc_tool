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

package top.techmczs.cuitxcpctool.common;


import lombok.Getter;
import java.util.Arrays;
import java.util.Optional;

/**
 * 标准CSS颜色枚举
 * 按 HEX 十六进制色值升序排列
 */
@Getter
public enum ColorMap {

    BLACK("black", "#000000", "黑色"),
    NAVY("navy", "#000080", "藏青色"),
    DARK_BLUE("darkblue", "#00008B", "深蓝色"),
    MEDIUM_BLUE("mediumblue", "#0000CD", "中蓝色"),
    BLUE("blue", "#0000FF", "蓝色"),
    DARK_GREEN("darkgreen", "#006400", "深绿色"),
    DARK_CYAN("darkcyan", "#008B8B", "深青色"),
    TEAL("teal", "#008080", "水鸭绿"),
    DARK_RED("darkred", "#8B0000", "深红色"),
    DARK_MAGENTA("darkmagenta", "#8B008B", "深洋红"),
    PURPLE("purple", "#800080", "紫色"),
    INDIGO("indigo", "#4B0082", "靛蓝色"),
    DARK_SLATE_BLUE("darkslateblue", "#483D8B", "深石板蓝"),
    MEDIUM_SLATE_BLUE("mediumslateblue", "#7B68EE", "中石板蓝"),
    SLATE_BLUE("slateblue", "#6A5ACD", "石板蓝"),
    DARK_VIOLET("darkviolet", "#9400D3", "深紫罗兰"),
    DARK_ORCHID("darkorchid", "#9932CC", "深兰花紫"),
    BLUE_VIOLET("blueviolet", "#8A2BE2", "蓝紫色"),
    FOREST_GREEN("forestgreen", "#228B22", "森林绿"),
    SEA_GREEN("seagreen", "#2E8B57", "海洋绿"),
    DARK_SEA_GREEN("darkseagreen", "#8FBC8F", "深海绿"),
    MEDIUM_SEA_GREEN("mediumseagreen", "#3CB371", "中海绿"),
    LIGHT_SEA_GREEN("lightseagreen", "#20B2AA", "浅海绿"),
    DARK_TURQUOISE("darkturquoise", "#00CED1", "深绿松石"),
    MEDIUM_TURQUOISE("mediumturquoise", "#48D1CC", "中绿松石"),
    TURQUOISE("turquoise", "#40E0D0", "绿松石色"),
    CYAN("cyan", "#00FFFF", "青色"),
    AQUA("aqua", "#00FFFF", "水色"),
    AQUAMARINE("aquamarine", "#7FFFD4", "碧绿色"),
    PALE_TURQUOISE("paleturquoise", "#AFEEEE", "浅绿松石"),
    LIGHT_CYAN("lightcyan", "#E0FFFF", "浅青色"),
    MIDNIGHT_BLUE("midnightblue", "#191970", "午夜蓝"),
    ROYAL_BLUE("royalblue", "#4169E1", "皇家蓝"),
    STEEL_BLUE("steelblue", "#4682B4", "钢蓝色"),
    DODGER_BLUE("dodgerblue", "#1E90FF", "道奇蓝"),
    DEEP_SKY_BLUE("deepskyblue", "#00BFFF", "深天蓝"),
    LIGHT_SKY_BLUE("lightskyblue", "#87CEFA", "浅天蓝"),
    SKY_BLUE("skyblue", "#87CEEB", "天蓝色"),
    LIGHT_BLUE("lightblue", "#ADD8E6", "浅蓝色"),
    POWDER_BLUE("powderblue", "#B0E0E6", "粉蓝色"),
    CADET_BLUE("cadetblue", "#5F9EA0", "军校蓝"),
    CORNFLOWER_BLUE("cornflowerblue", "#6495ED", "矢车菊蓝"),
    LIME("lime", "#00FF00", "酸橙绿"),
    SPRING_GREEN("springgreen", "#00FF7F", "春绿色"),
    MEDIUM_SPRING_GREEN("mediumspringgreen", "#00FA9A", "中春绿"),
    CHARTREUSE("chartreuse", "#7FFF00", "查特绿"),
    LAWN_GREEN("lawngreen", "#7CFC00", "草坪绿"),
    GREEN("green", "#008000", "绿色"),
    OLIVE_DRAB("olivedrab", "#6B8E23", "橄榄褐绿"),
    DARK_OLIVE_GREEN("darkolivegreen", "#556B2F", "深橄榄绿"),
    YELLOW_GREEN("yellowgreen", "#9ACD32", "黄绿色"),
    GREEN_YELLOW("greenyellow", "#ADFF2F", "绿黄色"),
    MAROON("maroon", "#800000", "栗色"),
    FIRE_BRICK("firebrick", "#B22222", "火砖红"),
    BROWN("brown", "#A52A2A", "棕色"),
    SIENNA("sienna", "#A0522D", "赭石色"),
    SADDLE_BROWN("saddlebrown", "#8B4513", "马鞍棕"),
    CHOCOLATE("chocolate", "#D2691E", "巧克力色"),
    PERU("peru", "#CD853F", "秘鲁棕"),
    BURLY_WOOD("burlywood", "#DEB887", "原木色"),
    TAN("tan", "#D2B48C", "黄褐色"),
    WHEAT("wheat", "#F5DEB3", "小麦色"),
    NAVAJO_WHITE("navajowhite", "#FFDEAD", "纳瓦霍白"),
    PEACH_PUFF("peachpuff", "#FFDAB9", "桃肉色"),
    BISQUE("bisque", "#FFE4C4", "橘肉色"),
    BLANCHED_ALMOND("blanchedalmond", "#FFEBCD", "杏仁白"),
    ANTIQUE_WHITE("antiquewhite", "#FAEBD7", "古董白"),
    OLD_LACE("oldlace", "#FDF5E6", "旧蕾丝白"),
    CORNSILK("cornsilk", "#FFF8DC", "玉米丝色"),
    FLORAL_WHITE("floralwhite", "#FFFAF0", "花白色"),
    IVORY("ivory", "#FFFFF0", "象牙白"),
    HONEYDEW("honeydew", "#F0FFF0", "蜜瓜色"),
    MINT_CREAM("mintcream", "#F5FFFA", "薄荷奶油"),
    AZURE("azure", "#F0FFFF", "蔚蓝色"),
    ALICE_BLUE("aliceblue", "#F0F8FF", "爱丽丝蓝"),
    LAVENDER("lavender", "#E6E6FA", "淡紫色"),
    THISTLE("thistle", "#D8BFD8", "蓟紫色"),
    PLUM("plum", "#DDA0DD", "李子紫"),
    VIOLET("violet", "#EE82EE", "紫罗兰色"),
    ORCHID("orchid", "#DA70D6", "兰花紫"),
    MEDIUM_ORCHID("mediumorchid", "#BA55D3", "中兰花紫"),
    MEDIUM_PURPLE("mediumpurple", "#9370DB", "中紫色"),
    PALE_VIOLET_RED("palevioletred", "#DB7093", "浅紫红"),
    MEDIUM_VIOLET_RED("mediumvioletred", "#C71585", "中紫红"),
    HOT_PINK("hotpink", "#FF69B4", "亮粉色"),
    DEEP_PINK("deeppink", "#FF1493", "深粉色"),
    CRIMSON("crimson", "#DC143C", "绯红"),
    RED("red", "#FF0000", "红色"),
    ORANGE_RED("orangered", "#FF4500", "橙红色"),
    TOMATO("tomato", "#FF6347", "番茄红"),
    CORAL("coral", "#FF7F50", "珊瑚色"),
    LIGHT_SALMON("lightsalmon", "#FFA07A", "浅鲑鱼色"),
    SALMON("salmon", "#FA8072", "鲑鱼色"),
    DARK_SALMON("darksalmon", "#E9967A", "深鲑鱼色"),
    DARK_ORANGE("darkorange", "#FF8C00", "深橙色"),
    ORANGE("orange", "#FFA500", "橙色"),
    GOLDENROD("goldenrod", "#DAA520", "金麒麟色"),
    DARK_GOLDENROD("darkgoldenrod", "#B8860B", "深金棕"),
    KHAKI("khaki", "#F0E68C", "卡其色"),
    DARK_KHAKI("darkkhaki", "#BDB76B", "深卡其"),
    PALE_GOLDENROD("palegoldenrod", "#EEE8AA", "浅金褐"),
    LIGHT_GOLDENROD_YELLOW("lightgoldenrodyellow", "#FAFAD2", "浅金黄"),
    YELLOW("yellow", "#FFFF00", "黄色"),
    LIGHT_YELLOW("lightyellow", "#FFFFE0", "浅黄色"),
    PAPAYAWHIP("papayawhip", "#FFEFD5", "木瓜色"),
    MOCCASIN("moccasin", "#FFE4B5", "鹿皮色"),
    MISTY_ROSE("mistyrose", "#FFE4E1", "雾玫瑰色"),
    LAVENDER_BLUSH("lavenderblush", "#FFF0F5", "淡紫红粉"),
    SEA_SHELL("seashell", "#FFF5EE", "贝壳白"),
    SNOW("snow", "#FFFAFA", "雪白色"),
    GHOST_WHITE("ghostwhite", "#F8F8FF", "幽灵白"),
    WHITE_SMOKE("whitesmoke", "#F5F5F5", "白烟色"),
    GAINSBORO("gainsboro", "#DCDCDC", "浅灰蓝"),
    LIGHT_GREY("lightgray", "#D3D3D3", "浅灰色"),
    SILVER("silver", "#C0C0C0", "银色"),
    DARK_GRAY("darkgray", "#A9A9A9", "深灰色"),
    GRAY("gray", "#808080", "灰色"),
    LIGHT_SLATE_GRAY("lightslategray", "#778899", "浅石板灰"),
    SLATE_GRAY("slategray", "#708090", "石板灰"),
    DARK_SLATE_GRAY("darkslategray", "#2F4F4F", "深石板灰"),
    DIM_GRAY("dimgray", "#696969", "暗灰色"),
    ROSY_BROWN("rosybrown", "#BC8F8F", "玫瑰棕"),
    LIGHT_PINK("lightpink", "#FFB6C1", "浅粉色"),
    PINK("pink", "#FFC0CB", "粉色"),
    FUCHSIA("fuchsia", "#FF00FF", "紫红色"),
    MAGENTA("magenta", "#FF00FF", "洋红色"),
    SANDY_BROWN("sandybrown", "#F4A460", "沙褐色"),
    GOLD("gold", "#FFD700", "金色"),
    LINEN("linen", "#FAF0E6", "亚麻色"),
    BEIGE("beige", "#F5F5DC", "米黄色"),
    WHITE("white", "#FFFFFF", "白色");

    private final String colorName;
    private final String hex;
    private final String chineseName;

    ColorMap(String colorName, String hex, String chineseName) {
        this.colorName = colorName;
        this.hex = hex;
        this.chineseName = chineseName;
    }

    /**
     * 根据英文颜色名获取中文名称（自动兼容大小写、空格）
     */
    public static String getChineseName(String color) {
        if (color == null || color.isBlank()) {
            return "-";
        }
        String key = color.toLowerCase().trim();
        Optional<ColorMap> enumOpt = Arrays.stream(ColorMap.values())
                .filter(e -> e.getColorName().equals(key))
                .findFirst();
        return enumOpt.map(ColorMap::getChineseName).orElse(color);
    }
}