import fs from 'fs';
import path from 'path';
import * as docx from 'docx';

const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  HeadingLevel,
  BorderStyle,
  Header,
  Footer,
  PageNumber,
  PageBreak,
} = docx;

// Color Palette
const COLORS = {
  primary: '1E3A8A',      // Deep Navy
  secondary: '2563EB',    // Royal Blue
  accent: '0D9488',       // Teal
  darkText: '1E293B',     // Slate-800
  mutedText: '64748B',    // Slate-500
  lightBg: 'F8FAFC',      // Slate-50
  codeBg: 'F1F5F9',       // Slate-100
  border: 'CBD5E1',       // Slate-300
  tableHeaderBg: '1E3A8A',
  tableRowEven: 'FFFFFF',
  tableRowOdd: 'F8FAFC',
  codeBorder: '3B82F6',
  white: 'FFFFFF',
};

const FONT_BODY = 'Calibri';
const FONT_HEADING = 'Calibri';
const FONT_CODE = 'Consolas';

// Parse inline markdown
function parseInlineRuns(text, options = {}) {
  const baseSize = options.size || 22; // 11pt default
  const baseColor = options.color || COLORS.darkText;
  const baseFont = options.font || FONT_BODY;

  const runs = [];
  // Tokenize bold-italic (***), bold (**), italic (*), code (`), link ([text](url)), math ($...$)
  const tokenRegex = /(\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|\$\$[^$]+\$\$|\$[^$]+\$)/g;
  let lastIndex = 0;
  let match;

  while ((match = tokenRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      const plain = text.substring(lastIndex, match.index);
      if (plain) {
        runs.push(new TextRun({
          text: plain,
          font: baseFont,
          size: baseSize,
          color: baseColor,
          bold: options.bold,
          italics: options.italics,
        }));
      }
    }

    const token = match[0];
    if (token.startsWith('***') && token.endsWith('***')) {
      runs.push(new TextRun({
        text: token.slice(3, -3),
        font: baseFont,
        size: baseSize,
        color: baseColor,
        bold: true,
        italics: true,
      }));
    } else if (token.startsWith('**') && token.endsWith('**')) {
      runs.push(new TextRun({
        text: token.slice(2, -2),
        font: baseFont,
        size: baseSize,
        color: options.color || (options.isTableHeader ? COLORS.white : '0F172A'),
        bold: true,
        italics: options.italics,
      }));
    } else if (token.startsWith('*') && token.endsWith('*')) {
      runs.push(new TextRun({
        text: token.slice(1, -1),
        font: baseFont,
        size: baseSize,
        color: baseColor,
        bold: options.bold,
        italics: true,
      }));
    } else if (token.startsWith('`') && token.endsWith('`')) {
      runs.push(new TextRun({
        text: token.slice(1, -1),
        font: FONT_CODE,
        size: Math.max(18, baseSize - 2),
        color: '0369A1',
        shading: { fill: COLORS.codeBg },
        bold: true,
      }));
    } else if (token.startsWith('[') && token.includes('](')) {
      const closingBracket = token.indexOf('](');
      const linkText = token.slice(1, closingBracket);
      const url = token.slice(closingBracket + 2, -1);
      runs.push(new TextRun({
        text: linkText,
        font: baseFont,
        size: baseSize,
        color: COLORS.secondary,
        underline: {},
      }));
    } else if (token.startsWith('$') && token.endsWith('$')) {
      let formula = token;
      if (formula.startsWith('$$') && formula.endsWith('$$')) {
        formula = formula.slice(2, -2);
      } else {
        formula = formula.slice(1, -1);
      }
      formula = formula
        .replace(/\\text\{([^}]+)\}/g, '$1')
        .replace(/\\times/g, ' × ')
        .replace(/\\sum/g, '∑')
        .replace(/\\rightarrow/g, ' → ')
        .replace(/\\_/g, '_')
        .replace(/_\{([^}]+)\}/g, '_$1');
      runs.push(new TextRun({
        text: formula,
        font: FONT_BODY,
        size: baseSize,
        color: COLORS.primary,
        italics: true,
      }));
    }

    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    const remaining = text.substring(lastIndex);
    if (remaining) {
      runs.push(new TextRun({
        text: remaining,
        font: baseFont,
        size: baseSize,
        color: baseColor,
        bold: options.bold,
        italics: options.italics,
      }));
    }
  }

  return runs;
}

// Convert cell text with <br> into paragraphs
function cellTextToParagraphs(rawCellText, isHeader = false) {
  const parts = rawCellText.split(/<br\s*\/?>/i);
  return parts.map((part, pIdx) => {
    let cleanText = part.trim();
    let isBullet = false;
    if (cleanText.startsWith('- ')) {
      isBullet = true;
      cleanText = cleanText.substring(2);
    }
    const runs = parseInlineRuns(cleanText, {
      size: isHeader ? 21 : 19, // 10.5pt header, 9.5pt body
      color: isHeader ? COLORS.white : COLORS.darkText,
      bold: isHeader,
      isTableHeader: isHeader,
    });

    return new Paragraph({
      alignment: isHeader ? AlignmentType.CENTER : AlignmentType.LEFT,
      spacing: {
        before: pIdx === 0 ? 60 : 30,
        after: pIdx === parts.length - 1 ? 60 : 30,
        line: 240,
      },
      indent: isBullet ? { left: 240, hanging: 160 } : undefined,
      children: isBullet
        ? [new TextRun({ text: '• ', font: FONT_BODY, size: 19, bold: true, color: isHeader ? COLORS.white : COLORS.secondary }), ...runs]
        : runs,
    });
  });
}

// Main conversion function
export async function convertMarkdownToDocx(mdPath, docxPath) {
  const markdown = fs.readFileSync(mdPath, 'utf8');
  const lines = markdown.split(/\r?\n/);

  const docElements = [];

  // Helper for major sections to add a page break before
  let firstMajorSectionEncountered = false;

  let i = 0;
  while (i < lines.length) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    // 1. Cover page detection
    if (line === '# TRƯỜNG ĐẠI HỌC CÔNG NGHỆ THÔNG TIN & TRUYỀN THÔNG') {
      // Build cover page
      docElements.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 200, after: 80 },
          children: [
            new TextRun({
              text: 'TRƯỜNG ĐẠI HỌC CÔNG NGHỆ THÔNG TIN & TRUYỀN THÔNG',
              font: FONT_HEADING,
              bold: true,
              size: 26, // 13pt
              color: COLORS.primary,
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 300 },
          children: [
            new TextRun({
              text: 'KHOA CÔNG NGHỆ THÔNG TIN',
              font: FONT_HEADING,
              bold: true,
              size: 24, // 12pt
              color: COLORS.accent,
            }),
          ],
        }),
        // Divider line
        new Paragraph({
          alignment: AlignmentType.CENTER,
          border: {
            bottom: { color: COLORS.secondary, size: 16, style: BorderStyle.SINGLE, space: 4 },
          },
          spacing: { before: 0, after: 800 },
          children: [],
        }),
        // Main Title
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 400, after: 150 },
          children: [
            new TextRun({
              text: 'BÁO CÁO THIẾT KẾ & XÂY DỰNG HỆ THỐNG',
              font: FONT_HEADING,
              bold: true,
              size: 34, // 17pt
              color: '0F172A',
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 100, after: 200 },
          children: [
            new TextRun({
              text: 'HỆ THỐNG ĐẶT PHÒNG KHÁCH SẠN TRỰC TUYẾN AURA STAY',
              font: FONT_HEADING,
              bold: true,
              size: 40, // 20pt
              color: COLORS.primary,
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 100, after: 1000 },
          children: [
            new TextRun({
              text: '“Nghỉ Dưỡng Hoàn Hảo. Trải Nghiệm Thảnh Thơi.”',
              font: FONT_BODY,
              italics: true,
              size: 26, // 13pt
              color: 'D97706', // warm amber/gold
            }),
          ],
        }),
        // Project metadata card
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 8, color: COLORS.border },
            bottom: { style: BorderStyle.SINGLE, size: 8, color: COLORS.border },
            left: { style: BorderStyle.SINGLE, size: 24, color: COLORS.secondary },
            right: { style: BorderStyle.SINGLE, size: 8, color: COLORS.border },
            insideHorizontal: { style: BorderStyle.NONE },
            insideVertical: { style: BorderStyle.NONE },
          },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  shading: { fill: COLORS.lightBg },
                  margins: { top: 200, bottom: 200, left: 260, right: 260 },
                  children: [
                    new Paragraph({
                      spacing: { line: 280, after: 60 },
                      children: [
                        new TextRun({ text: '• Đề tài: ', bold: true, size: 22, color: COLORS.primary }),
                        new TextRun({ text: 'Hệ thống Đặt phòng Khách sạn & Resort Nghỉ dưỡng Toàn diện', size: 22 }),
                      ],
                    }),
                    new Paragraph({
                      spacing: { line: 280, after: 60 },
                      children: [
                        new TextRun({ text: '• Kiến trúc: ', bold: true, size: 22, color: COLORS.primary }),
                        new TextRun({ text: 'Full-Stack Serverless Edge (React 19 + HonoJS + Cloudflare D1/R2)', size: 22 }),
                      ],
                    }),
                    new Paragraph({
                      spacing: { line: 280, after: 60 },
                      children: [
                        new TextRun({ text: '• Trợ lý Ảo: ', bold: true, size: 22, color: COLORS.primary }),
                        new TextRun({ text: 'Hybrid Concierge AI (Google Gemini 2.5 Flash + D1 Real-time)', size: 22 }),
                      ],
                    }),
                    new Paragraph({
                      spacing: { line: 280, after: 0 },
                      children: [
                        new TextRun({ text: '• Phiên bản: ', bold: true, size: 22, color: COLORS.primary }),
                        new TextRun({ text: '1.0.0 - Năm 2026', size: 22 }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 1200, after: 0 },
          children: [
            new TextRun({
              text: 'NĂM THỰC HIỆN: 2026',
              font: FONT_HEADING,
              bold: true,
              size: 22,
              color: COLORS.mutedText,
            }),
          ],
        }),
        new Paragraph({
          children: [new PageBreak()],
        })
      );

      // Skip until after the title block separator
      while (i < lines.length && !lines[i].startsWith('## MỤC LỤC')) {
        i++;
      }
      continue;
    }

    // 2. Table of Contents
    if (line === '## MỤC LỤC') {
      docElements.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.LEFT,
          spacing: { before: 240, after: 200 },
          border: {
            bottom: { color: COLORS.primary, size: 12, style: BorderStyle.SINGLE, space: 6 },
          },
          children: [
            new TextRun({
              text: 'MỤC LỤC BÁO CÁO',
              font: FONT_HEADING,
              bold: true,
              size: 32, // 16pt
              color: COLORS.primary,
            }),
          ],
        })
      );
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('---') && !lines[i].trim().startsWith('# 1.')) {
        const tocLine = lines[i];
        const trimmed = tocLine.trim();
        if (trimmed.startsWith('- [')) {
          const match = trimmed.match(/- \[([^\]]+)\]\(([^)]+)\)/);
          if (match) {
            const title = match[1];
            const isSub = tocLine.startsWith('  - [');
            const isSubSub = tocLine.startsWith('    - [');
            const indentLevel = isSubSub ? 720 : isSub ? 360 : 0;
            const isMajor = !isSub && !isSubSub;

            docElements.push(
              new Paragraph({
                spacing: { line: 260, before: isMajor ? 80 : 30, after: isMajor ? 50 : 30 },
                indent: { left: indentLevel },
                children: [
                  new TextRun({
                    text: isMajor ? title : title,
                    font: FONT_BODY,
                    bold: isMajor,
                    size: isMajor ? 22 : 20,
                    color: isMajor ? COLORS.primary : COLORS.darkText,
                  }),
                ],
              })
            );
          }
        }
        i++;
      }

      // Add page break after Table of Contents
      docElements.push(
        new Paragraph({
          children: [new PageBreak()],
        })
      );
      continue;
    }

    // Skip horizontal divider line
    if (line === '---') {
      i++;
      continue;
    }

    // 3. Fenced Code Blocks (```)
    if (line.startsWith('```')) {
      const lang = line.slice(3).trim();
      i++;
      const codeLines = [];
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```

      // Distinguish ASCII diagrams vs normal code
      const isDiagram = codeLines.some(l => l.includes('│') || l.includes('┌') || l.includes('├') || l.includes('▼'));
      const codeFontSize = isDiagram ? 16 : 18; // 8pt for diagram, 9pt for code

      const codeParagraphs = codeLines.map((cLine, idx) => {
        return new Paragraph({
          shading: { fill: COLORS.codeBg },
          border: {
            left: { color: COLORS.codeBorder, size: 18, space: 10, style: BorderStyle.SINGLE },
          },
          indent: { left: 240 },
          spacing: {
            line: 220,
            before: idx === 0 ? 80 : 0,
            after: idx === codeLines.length - 1 ? 80 : 0,
          },
          children: [
            new TextRun({
              text: cLine || ' ',
              font: FONT_CODE,
              size: codeFontSize,
              color: '0F172A',
            }),
          ],
        });
      });

      docElements.push(...codeParagraphs);
      // Small spacing after code block
      docElements.push(new Paragraph({ spacing: { before: 0, after: 140 }, children: [] }));
      continue;
    }

    // 4. Markdown Tables
    if (line.startsWith('|') && line.endsWith('|')) {
      const tableLines = [];
      while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
        tableLines.push(lines[i].trim());
        i++;
      }

      if (tableLines.length >= 2) {
        const headerRowRaw = tableLines[0];
        const separatorRowRaw = tableLines[1];
        const dataRowsRaw = tableLines.slice(2);

        const parseCols = rowStr =>
          rowStr
            .split('|')
            .slice(1, -1)
            .map(c => c.trim());

        const headers = parseCols(headerRowRaw);
        const colCount = headers.length;

        // Determine column widths
        // Printable page width A4 is ~9026 twips (11906 - 2880)
        let colWidths = [];
        if (colCount === 2) {
          colWidths = [2600, 6426];
        } else if (colCount === 3) {
          colWidths = [2400, 3600, 3026];
        } else if (colCount === 4) {
          colWidths = [1900, 2000, 1400, 3726];
        } else {
          const w = Math.floor(9026 / colCount);
          colWidths = Array(colCount).fill(w);
          colWidths[colCount - 1] += 9026 - w * colCount;
        }

        const tableRows = [];

        // Header Row
        tableRows.push(
          new TableRow({
            tableHeader: true,
            cantSplit: true,
            children: headers.map((hText, hIdx) => {
              return new TableCell({
                width: { size: colWidths[hIdx], type: WidthType.DXA },
                shading: { fill: COLORS.tableHeaderBg },
                margins: { top: 140, bottom: 140, left: 160, right: 160 },
                borders: {
                  top: { style: BorderStyle.SINGLE, size: 6, color: COLORS.tableHeaderBg },
                  bottom: { style: BorderStyle.SINGLE, size: 12, color: COLORS.primary },
                  left: { style: BorderStyle.SINGLE, size: 4, color: '3B82F6' },
                  right: { style: BorderStyle.SINGLE, size: 4, color: '3B82F6' },
                },
                children: cellTextToParagraphs(hText, true),
              });
            }),
          })
        );

        // Data Rows
        dataRowsRaw.forEach((rowStr, rIdx) => {
          const cells = parseCols(rowStr);
          const isOdd = rIdx % 2 === 1;
          const rowBg = isOdd ? COLORS.tableRowOdd : COLORS.tableRowEven;

          tableRows.push(
            new TableRow({
              cantSplit: false,
              children: headers.map((_, cIdx) => {
                const cellText = cells[cIdx] || '';
                return new TableCell({
                  width: { size: colWidths[cIdx], type: WidthType.DXA },
                  shading: { fill: rowBg },
                  margins: { top: 120, bottom: 120, left: 160, right: 160 },
                  borders: {
                    top: { style: BorderStyle.SINGLE, size: 4, color: COLORS.border },
                    bottom: { style: BorderStyle.SINGLE, size: 4, color: COLORS.border },
                    left: { style: BorderStyle.SINGLE, size: 4, color: COLORS.border },
                    right: { style: BorderStyle.SINGLE, size: 4, color: COLORS.border },
                  },
                  children: cellTextToParagraphs(cellText, false),
                });
              }),
            })
          );
        });

        docElements.push(
          new Table({
            width: { size: 9026, type: WidthType.DXA },
            rows: tableRows,
          })
        );
        docElements.push(new Paragraph({ spacing: { before: 0, after: 160 }, children: [] }));
      }
      continue;
    }

    // 5. Headings
    if (line.startsWith('# ')) {
      const headingText = line.replace(/^#\s+/, '').trim();

      // Check if this is a major numbered chapter (e.g. "1. TỔNG QUAN DỰ ÁN", "2. KIẾN TRÚC...", etc.)
      const isMajorChapter = /^[0-9]+\.\s+/.test(headingText);

      if (isMajorChapter && firstMajorSectionEncountered) {
        // Page break before major chapters 2, 3, 4, 5, 6, 7, 8, 9, 10
        docElements.push(new Paragraph({ children: [new PageBreak()] }));
      }
      if (isMajorChapter) {
        firstMajorSectionEncountered = true;
      }

      docElements.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 360, after: 140 },
          border: {
            bottom: { color: COLORS.primary, size: 16, style: BorderStyle.SINGLE, space: 6 },
          },
          children: [
            new TextRun({
              text: headingText,
              font: FONT_HEADING,
              bold: true,
              size: 32, // 16pt
              color: COLORS.primary,
            }),
          ],
        })
      );
      i++;
      continue;
    }

    if (line.startsWith('## ')) {
      const headingText = line.replace(/^##\s+/, '').trim();
      docElements.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 260, after: 100 },
          children: [
            new TextRun({
              text: headingText,
              font: FONT_HEADING,
              bold: true,
              size: 26, // 13pt
              color: COLORS.secondary,
            }),
          ],
        })
      );
      i++;
      continue;
    }

    if (line.startsWith('### ')) {
      const headingText = line.replace(/^###\s+/, '').trim();
      docElements.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 200, after: 80 },
          children: parseInlineRuns(headingText, {
            size: 23, // 11.5pt
            bold: true,
            font: FONT_HEADING,
            color: '0F172A',
          }),
        })
      );
      i++;
      continue;
    }

    if (line.startsWith('#### ')) {
      const headingText = line.replace(/^####\s+/, '').trim();
      docElements.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_4,
          spacing: { before: 160, after: 60 },
          children: parseInlineRuns(headingText, {
            size: 22,
            bold: true,
            font: FONT_HEADING,
            color: '334155',
          }),
        })
      );
      i++;
      continue;
    }

    // 6. Block Math Formulas ($$)
    if (line.startsWith('$$') && line.endsWith('$$')) {
      let formula = line.slice(2, -2).trim();
      formula = formula
        .replace(/\\text\{([^}]+)\}/g, '$1')
        .replace(/\\times/g, ' × ')
        .replace(/\\sum_\{([^}]+)\}\^\{([^}]+)\}/g, '∑ ($1 → $2)')
        .replace(/\\sum/g, '∑')
        .replace(/\\rightarrow/g, ' → ')
        .replace(/\\_/g, '_');

      docElements.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          shading: { fill: COLORS.lightBg },
          border: {
            top: { color: COLORS.border, size: 4, style: BorderStyle.SINGLE },
            bottom: { color: COLORS.border, size: 4, style: BorderStyle.SINGLE },
            left: { color: COLORS.secondary, size: 16, style: BorderStyle.SINGLE },
            right: { color: COLORS.border, size: 4, style: BorderStyle.SINGLE },
          },
          spacing: { before: 120, after: 120, line: 280 },
          children: [
            new TextRun({
              text: formula,
              font: FONT_BODY,
              size: 22,
              bold: true,
              italics: true,
              color: COLORS.primary,
            }),
          ],
        })
      );
      i++;
      continue;
    }

    // 7. Lists (Bullet points & Numbered lists)
    if (/^\s*[-*+]\s+/.test(rawLine)) {
      const match = rawLine.match(/^(\s*)([-*+])\s+(.*)$/);
      if (match) {
        const indentSpaces = match[1].length;
        const level = indentSpaces >= 4 ? 1 : 0;
        const content = match[3];

        docElements.push(
          new Paragraph({
            bullet: { level },
            spacing: { before: 40, after: 40, line: 260 },
            children: parseInlineRuns(content, { size: 22 }),
          })
        );
      }
      i++;
      continue;
    }

    if (/^\s*([0-9]+)\.\s+/.test(rawLine)) {
      const match = rawLine.match(/^(\s*)([0-9]+)\.\s+(.*)$/);
      if (match) {
        const num = match[2];
        const content = match[3];
        const indentSpaces = match[1].length;
        const leftIndent = indentSpaces >= 4 ? 640 : 360;

        docElements.push(
          new Paragraph({
            indent: { left: leftIndent, hanging: 240 },
            spacing: { before: 50, after: 50, line: 260 },
            children: [
              new TextRun({
                text: `${num}. `,
                bold: true,
                color: COLORS.primary,
                size: 22,
              }),
              ...parseInlineRuns(content, { size: 22 }),
            ],
          })
        );
      }
      i++;
      continue;
    }

    // 8. Normal Paragraph
    if (line.length > 0) {
      docElements.push(
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { before: 60, after: 120, line: 276 },
          children: parseInlineRuns(line, { size: 22 }),
        })
      );
    }

    i++;
  }

  // Create Document
  const doc = new Document({
    title: 'Báo Cáo Thiết Kế Hệ Thống Đặt Phòng Khách Sạn Trực Tuyến Aura Stay',
    description: 'Báo Cáo Thiết Kế & Xây Dựng Hệ Thống Aura Stay',
    creator: 'Trường Đại học Công nghệ Thông tin & Truyền thông',
    sections: [
      {
        properties: {
          page: {
            size: {
              width: 11906, // A4 width in twips
              height: 16838, // A4 height in twips
            },
            margin: {
              top: 1440, // 1 inch = 25.4mm
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
          titlePage: true, // First page has no header/footer
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                spacing: { after: 100 },
                border: {
                  bottom: { color: COLORS.border, size: 6, style: BorderStyle.SINGLE, space: 4 },
                },
                children: [
                  new TextRun({
                    text: 'AURA STAY — BÁO CÁO THIẾT KẾ & XÂY DỰNG HỆ THỐNG',
                    font: FONT_HEADING,
                    size: 17, // 8.5pt
                    color: COLORS.mutedText,
                    bold: true,
                  }),
                ],
              }),
            ],
          }),
          first: new Header({ children: [] }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                spacing: { before: 100 },
                border: {
                  top: { color: COLORS.border, size: 6, style: BorderStyle.SINGLE, space: 4 },
                },
                children: [
                  new TextRun({
                    text: 'Hệ Thống Đặt Phòng Khách Sạn Trực Tuyến Aura Stay  |  Trang ',
                    font: FONT_BODY,
                    size: 18, // 9pt
                    color: COLORS.mutedText,
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    font: FONT_BODY,
                    size: 18,
                    bold: true,
                    color: COLORS.primary,
                  }),
                  new TextRun({
                    text: ' / ',
                    font: FONT_BODY,
                    size: 18,
                    color: COLORS.mutedText,
                  }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                    font: FONT_BODY,
                    size: 18,
                    color: COLORS.mutedText,
                  }),
                ],
              }),
            ],
          }),
          first: new Footer({ children: [] }),
        },
        children: docElements,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(docxPath, buffer);
  console.log(`Successfully generated Word document: ${docxPath} (${buffer.length} bytes)`);
}

// CLI entrypoint
const inputMd = path.resolve('d:/web-banhang/Bao_Cao_Thiet_Ke_He_Thong_Dat_Phong.md');
const outputDocx = path.resolve('d:/web-banhang/Bao_Cao_Thiet_Ke_He_Thong_Dat_Phong.docx');

convertMarkdownToDocx(inputMd, outputDocx).catch(err => {
  console.error('Error generating docx:', err);
  process.exit(1);
});

