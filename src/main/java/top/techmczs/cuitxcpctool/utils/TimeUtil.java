package top.techmczs.cuitxcpctool.utils;

import cn.hutool.core.date.DateUtil;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;

/**
 * 通用时间转换工具类（极简版 | 无异常、无校验）
 */
public class TimeUtil {

    private static final ZoneId DEFAULT_ZONE = ZoneId.systemDefault();
    private static final long NANO_PER_SECOND = 1_000_000_000;

    private TimeUtil() {}

    /**
     * 秒级时间戳(带小数纳秒) 转换为 LocalDateTime
     */
    public static LocalDateTime timestampToLocalDateTime(double timestamp) {
        long seconds = (long) timestamp;
        int nano = (int) ((timestamp - seconds) * NANO_PER_SECOND);
        return Instant.ofEpochSecond(seconds, nano).atZone(DEFAULT_ZONE).toLocalDateTime();
    }

    /**
     * ISO8601时间 转 毫秒时间戳
     */
    public static long isoToMills(String isoTime) {
        return DateUtil.parse(isoTime).getTime();
    }

    /**
     * 时长(HH:MM:SS)转秒
     */
    public static int durationToSeconds(String duration) {
        String[] parts = duration.split(":");
        int hours = Integer.parseInt(parts[0]);
        int minutes = Integer.parseInt(parts[1]);
        double seconds = Double.parseDouble(parts[2]);
        return (int) (hours * 3600L + minutes * 60L + seconds);
    }
}