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
import java.util.UUID;

/**
 * PDF工具类（支持每页页眉 + 中文等宽字体）
 */
public class PdfUtil {
    private static final String BASE_DIR = System.getProperty("user.dir");
    public static final String PDF_DIR = BASE_DIR + File.separator + "pdf" + File.separator;
    // 你使用的字体路径
    private static final String FONT_PATH = "fonts/MapleMono-NF-CN-Regular.ttf";
    public static BaseFont MAPLE_FONT;

    // 静态加载字体
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
     * 页眉事件：每页自动生成页眉（核心功能）
     */
    public static class HeaderEvent extends PdfPageEventHelper {
        private final Team team;

        public HeaderEvent(Team team) {
            this.team = team;
        }

        // 每页结束时绘制页眉（保证每页都有）
        @Override
        public void onEndPage(PdfWriter writer, Document document) {
            PdfContentByte cb = writer.getDirectContent();
            // 页眉字体样式
            Font headerFont = new Font(MAPLE_FONT, 11);
            // 页眉内容
            String header = String.format("Team: %s | ICPC ID: %s | Location: %s",
                    team.getTeamName(),
                    team.getExamNumber(),
                    team.getPosition());
            String splitLine = "-------------------------------------------------------------------------------";

            // 写入页眉（固定在页面顶部）
            ColumnText.showTextAligned(cb, Element.ALIGN_LEFT,
                    new Phrase(header, headerFont),
                    document.left(), document.top() + 10, 0);
            ColumnText.showTextAligned(cb, Element.ALIGN_LEFT,
                    new Phrase(splitLine, headerFont),
                    document.left(), document.top(), 0);
        }
    }

    @Deprecated
    public static String savePdf(MultipartFile file) throws Exception {
        String path = PDF_DIR + UUID.randomUUID() + ".pdf";
        file.transferTo(new File(path));
        return path;
    }

    /**
     * 生成代码PDF（每页带页眉 + 中文等宽）
     */
    public static String generatePdfFromCode(String code, Team team) throws Exception {
        String pdfPath = PDF_DIR + UUID.randomUUID() + ".pdf";
        Document document = new Document(PageSize.A4);
        PdfWriter writer = PdfWriter.getInstance(document, new FileOutputStream(pdfPath));

        // 注册页眉事件
        writer.setPageEvent(new HeaderEvent(team));

        document.open();
        // 代码字体样式
        Font codeFont = new Font(MAPLE_FONT, 10);
        Paragraph codePara = new Paragraph(code, codeFont);
        codePara.setLeading(12);
        // 直接添加代码，页眉由事件自动生成
        document.add(codePara);

        document.close();
        return pdfPath;
    }

    public static File readPdf(String path) {
        return new File(path);
    }
}