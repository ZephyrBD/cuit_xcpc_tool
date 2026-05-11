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


import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import org.springframework.core.io.ClassPathResource;
import org.springframework.util.StreamUtils;
import org.springframework.web.multipart.MultipartFile;
import top.techmczs.cuitxcpctool.entity.Team;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

/**
 * PDF工具类（页眉+页码嵌入分割线+位置修复）
 */
public class PdfUtil {
    private static final String BASE_DIR = System.getProperty("user.dir");
    public static final String PDF_DIR = BASE_DIR + File.separator + "pdf" + File.separator;
    private static final String FONT_PATH = "fonts/MapleMono-NF-CN-Regular.ttf";
    public static BaseFont MAPLE_FONT;

    static {
        new File(PDF_DIR).mkdirs();
        try {
            InputStream fontStream = new ClassPathResource(FONT_PATH).getInputStream();
            MAPLE_FONT = BaseFont.createFont(
                    FONT_PATH,
                    BaseFont.IDENTITY_H,
                    BaseFont.EMBEDDED,
                    true,
                    StreamUtils.copyToByteArray(fontStream),
                    null
            );
            fontStream.close();
        } catch (Exception ignored) {}
    }

    /**
     * 页眉事件：页码嵌入分割线，位置100%对齐修复版
     */
    public static class HeaderEvent extends PdfPageEventHelper {
        private final Team team;
        private int pageNumber = 0;
        private PdfTemplate totalPageTemplate;

        public HeaderEvent(Team team) {
            this.team = team;
        }

        @Override
        public void onOpenDocument(PdfWriter writer, Document document) {
            // 模板宽度设大一点，避免数字溢出
            totalPageTemplate = writer.getDirectContent().createTemplate(20, 16);
        }

        @Override
        public void onEndPage(PdfWriter writer, Document document) {
            pageNumber++;
            PdfContentByte cb = writer.getDirectContent();
            Font headerFont = new Font(MAPLE_FONT, 11);

            // 1. 顶部团队信息行
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            String now = LocalDateTime.now().format(formatter);
            String header = String.format("[%s] %s (%s) | %s",
                    team.getPosition(),
                    team.getTeamName(),
                    team.getExamNumber(),
                    now);

            // 先绘制固定部分：-- Page X of
            String pagePrefix = String.format("-- Page %d of ", pageNumber);
            // 后面的横线和固定文本
            String suffix = " -------------------------------------------CUIT XCPC TOOL--";

            // 绘制前缀
            ColumnText.showTextAligned(cb, Element.ALIGN_LEFT,
                    new Phrase(pagePrefix, headerFont),
                    document.left(), document.top(), 0);

            // 计算"-- Page X of "这段文本的宽度，用于定位总页数
            float prefixWidth = headerFont.getBaseFont().getWidthPoint(pagePrefix, headerFont.getSize());

            // 绘制总页数模板（和前缀同一行，Y坐标相同）
            cb.addTemplate(totalPageTemplate, document.left() + prefixWidth, document.top());

            // 绘制后面的横线和固定文本（接在总页数后面）
            ColumnText.showTextAligned(cb, Element.ALIGN_LEFT,
                    new Phrase(suffix, headerFont),
                    document.left() + prefixWidth + 20, document.top(), 0);

            // 绘制顶部团队信息
            ColumnText.showTextAligned(cb, Element.ALIGN_LEFT,
                    new Phrase(header, headerFont),
                    document.left(), document.top() + 13, 0);
        }

        @Override
        public void onCloseDocument(PdfWriter writer, Document document) {
            // 写入总页数，和文本基线对齐
            ColumnText.showTextAligned(totalPageTemplate, Element.ALIGN_LEFT,
                    new Phrase(String.valueOf(pageNumber), new Font(MAPLE_FONT, 11)),
                    0, 0, 0);
        }
    }

    @Deprecated
    public static String savePdf(MultipartFile file) throws Exception {
        String path = PDF_DIR + UUID.randomUUID() + ".pdf";
        file.transferTo(new File(path));
        return path;
    }

    public static String generatePdfFromCode(String code, Team team) throws Exception {
        String pdfPath = PDF_DIR + UUID.randomUUID() + ".pdf";
        Document document = new Document(PageSize.A4);
        PdfWriter writer = PdfWriter.getInstance(document, new FileOutputStream(pdfPath));
        writer.setPageEvent(new HeaderEvent(team));

        document.open();
        Font codeFont = new Font(MAPLE_FONT, 10);
        Paragraph codePara = new Paragraph(code, codeFont);
        codePara.setLeading(12);
        document.add(codePara);

        document.close();
        return pdfPath;
    }

    public static File readPdf(String path) {
        return new File(path);
    }
}