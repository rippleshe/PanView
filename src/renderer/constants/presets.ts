/**
 * Smart preset system — presets indexed by detected input format.
 *
 * Design principles:
 *  1. Universal robustness first: every preset MUST either work out-of-the-box
 *     OR clearly declare its external dependencies via `requiresTools`.
 *  2. CJK / Obsidian users: XeLaTeX for PDF (needs MiKTeX/TeX Live).
 *     Always provide an HTML alternative that requires zero external tools.
 *  3. Never apply params that can silently break output
 *     (e.g. --listings on non-LaTeX targets, --toc on plain-text output).
 *  4. wkhtmltopdf and weasyprint must be marked with requiresTools so the UI
 *     can warn the user instead of silently failing.
 */

export interface PresetVariable {
  key: string
  value: string
}

export interface PresetParam {
  id: string
  value?: unknown
}

export interface SmartPreset {
  id: string
  title: string
  description: string
  outputFormat: string
  params: PresetParam[]
  variables?: PresetVariable[]
  inputFormatOverride?: string
  tags?: string[]
  /**
   * External binaries this preset requires beyond pandoc itself.
   * Shown as a warning badge on the card so users know upfront.
   * Examples: ['XeLaTeX'], ['wkhtmltopdf']
   */
  requiresTools?: string[]
}

// ---------------------------------------------------------------------------
// MARKDOWN presets — covers .md / .markdown (including Obsidian vaults)
// ---------------------------------------------------------------------------
const MARKDOWN_PRESETS: SmartPreset[] = [
  {
    id: 'md-to-html-standalone',
    title: '→ HTML 页面',
    description: '生成带目录和代码高亮的完整 HTML 文件，可直接在浏览器打开。无需任何额外工具，Obsidian 笔记首选。',
    outputFormat: 'html',
    params: [
      { id: 'standalone', value: true },
      { id: 'toc', value: true },
      { id: 'highlight-style', value: 'tango' },
    ],
    tags: ['推荐', '零依赖', 'TOC', '代码高亮'],
  },
  {
    id: 'md-to-docx-report',
    title: '→ Word 报告',
    description: '生成带目录和章节编号的 Word 文档，格式兼容 Word 2016+，适合交付正式报告。',
    outputFormat: 'docx',
    params: [
      { id: 'toc', value: true },
      { id: 'toc-depth', value: 3 },
      { id: 'number-sections', value: true },
    ],
    tags: ['推荐', 'TOC', '编号'],
  },
  {
    id: 'md-to-docx-simple',
    title: '→ Word（简洁）',
    description: '不带目录，直接转为干净的 Word 文档。适合短文、邮件草稿等轻量场景。',
    outputFormat: 'docx',
    params: [],
    tags: ['零依赖', '轻量'],
  },
  {
    id: 'md-to-pdf-cjk',
    title: '→ PDF（中文 / CJK）',
    description: '使用 XeLaTeX，完整支持中文、日文等 CJK 字符，自动生成目录。需要已安装 MiKTeX 或 TeX Live。',
    outputFormat: 'pdf',
    params: [
      { id: 'pdf-engine', value: 'xelatex' },
      { id: 'toc', value: true },
      { id: 'toc-depth', value: 3 },
      { id: 'number-sections', value: true },
    ],
    variables: [
      { key: 'CJKmainfont', value: 'Microsoft YaHei' },
      { key: 'CJKoptions', value: 'Scale=1.0' },
      { key: 'geometry', value: 'margin=2cm' },
    ],
    inputFormatOverride: 'markdown',
    tags: ['中文', 'TOC'],
    requiresTools: ['XeLaTeX (MiKTeX / TeX Live)'],
  },
  {
    id: 'md-to-pdf-wk',
    title: '→ PDF（网页引擎）',
    description: '通过 wkhtmltopdf 将 Markdown 渲染为 PDF，天然支持 Unicode，不依赖 LaTeX。需要单独安装 wkhtmltopdf。',
    outputFormat: 'pdf',
    params: [
      { id: 'pdf-engine', value: 'wkhtmltopdf' },
      { id: 'standalone', value: true },
      { id: 'highlight-style', value: 'tango' },
    ],
    tags: ['Unicode'],
    requiresTools: ['wkhtmltopdf'],
  },
  {
    id: 'md-to-epub',
    title: '→ EPUB 电子书',
    description: '生成带目录的 EPUB 文件，可导入 Kindle、Apple Books 等阅读器。',
    outputFormat: 'epub',
    params: [
      { id: 'toc', value: true },
      { id: 'toc-depth', value: 2 },
    ],
    tags: ['零依赖', '电子书'],
  },
]

// ---------------------------------------------------------------------------
// DOCX presets
// ---------------------------------------------------------------------------
const DOCX_PRESETS: SmartPreset[] = [
  {
    id: 'docx-to-md-preserve',
    title: '→ Markdown（保留格式）',
    description: '转为 Markdown 并保留原始换行，适合迁移内容到 Obsidian、Notion 等知识库。',
    outputFormat: 'markdown',
    params: [{ id: 'wrap', value: 'preserve' }],
    tags: ['推荐', '零依赖', '知识库迁移'],
  },
  {
    id: 'docx-to-md-clean',
    title: '→ Markdown（自动整理）',
    description: '转为 Markdown 并自动整理换行，适合在代码编辑器中继续编辑。',
    outputFormat: 'markdown',
    params: [{ id: 'wrap', value: 'auto' }],
    tags: ['零依赖', '编辑器友好'],
  },
  {
    id: 'docx-to-html',
    title: '→ HTML 页面',
    description: '将 Word 文档转为独立 HTML 文件，保留基本格式，适合网页发布或归档。',
    outputFormat: 'html',
    params: [{ id: 'standalone', value: true }],
    tags: ['零依赖', '网页'],
  },
  {
    id: 'docx-to-pdf-wk',
    title: '→ PDF',
    description: '通过 wkhtmltopdf 将 Word 转为 PDF，Unicode 安全。需要单独安装 wkhtmltopdf。',
    outputFormat: 'pdf',
    params: [
      { id: 'pdf-engine', value: 'wkhtmltopdf' },
      { id: 'standalone', value: true },
    ],
    tags: ['Unicode'],
    requiresTools: ['wkhtmltopdf'],
  },
]

// ---------------------------------------------------------------------------
// HTML presets
// ---------------------------------------------------------------------------
const HTML_PRESETS: SmartPreset[] = [
  {
    id: 'html-to-md',
    title: '→ Markdown',
    description: '将网页内容提取为干净的 Markdown，适合归档文章到 Obsidian 等知识库。',
    outputFormat: 'markdown',
    params: [{ id: 'wrap', value: 'none' }],
    tags: ['推荐', '零依赖', '归档'],
  },
  {
    id: 'html-to-docx',
    title: '→ Word 文档',
    description: '将 HTML 转为可编辑的 Word 文档，适合对网页内容进行后期编辑。',
    outputFormat: 'docx',
    params: [],
    tags: ['零依赖'],
  },
  {
    id: 'html-to-pdf-wk',
    title: '→ PDF',
    description: '使用 wkhtmltopdf 保留网页样式输出 PDF。需要单独安装 wkhtmltopdf。',
    outputFormat: 'pdf',
    params: [
      { id: 'pdf-engine', value: 'wkhtmltopdf' },
      { id: 'standalone', value: true },
    ],
    tags: ['网页存档'],
    requiresTools: ['wkhtmltopdf'],
  },
  {
    id: 'html-to-epub',
    title: '→ EPUB 电子书',
    description: '将 HTML 文章转为电子书格式，可导入 Kindle、Apple Books 等阅读器。',
    outputFormat: 'epub',
    params: [{ id: 'toc', value: true }],
    tags: ['零依赖', '电子书'],
  },
]

// ---------------------------------------------------------------------------
// RST presets
// ---------------------------------------------------------------------------
const RST_PRESETS: SmartPreset[] = [
  {
    id: 'rst-to-html',
    title: '→ HTML 页面',
    description: '将 reStructuredText 转为带目录的完整 HTML 页面，适合技术文档发布。',
    outputFormat: 'html',
    params: [
      { id: 'standalone', value: true },
      { id: 'toc', value: true },
    ],
    tags: ['推荐', '零依赖', '文档'],
  },
  {
    id: 'rst-to-docx',
    title: '→ Word 文档',
    description: '将 RST 转为 Word，适合需要进一步人工编辑的场景。',
    outputFormat: 'docx',
    params: [{ id: 'toc', value: true }],
    tags: ['零依赖'],
  },
  {
    id: 'rst-to-pdf-cjk',
    title: '→ PDF（中文）',
    description: '使用 XeLaTeX 输出支持中文的 PDF。需要已安装 MiKTeX 或 TeX Live。',
    outputFormat: 'pdf',
    params: [
      { id: 'pdf-engine', value: 'xelatex' },
      { id: 'toc', value: true },
    ],
    variables: [{ key: 'CJKmainfont', value: 'Microsoft YaHei' }],
    tags: ['中文'],
    requiresTools: ['XeLaTeX (MiKTeX / TeX Live)'],
  },
]

// ---------------------------------------------------------------------------
// LaTeX presets
// ---------------------------------------------------------------------------
const LATEX_PRESETS: SmartPreset[] = [
  {
    id: 'tex-to-pdf-xe',
    title: '→ PDF（XeLaTeX）',
    description: '使用 XeLaTeX 编译，支持中文和现代字体，学术文档首选。需要已安装 MiKTeX 或 TeX Live。',
    outputFormat: 'pdf',
    params: [{ id: 'pdf-engine', value: 'xelatex' }],
    variables: [{ key: 'CJKmainfont', value: 'Microsoft YaHei' }],
    tags: ['学术', '中文'],
    requiresTools: ['XeLaTeX (MiKTeX / TeX Live)'],
  },
  {
    id: 'tex-to-html',
    title: '→ HTML（含数学公式）',
    description: '将 LaTeX 转为 HTML，数学公式使用 MathJax 在浏览器中渲染。零依赖，效果好。',
    outputFormat: 'html',
    params: [
      { id: 'standalone', value: true },
      { id: 'mathjax', value: true },
    ],
    tags: ['推荐', '零依赖', '数学公式'],
  },
]

// ---------------------------------------------------------------------------
// EPUB presets
// ---------------------------------------------------------------------------
const EPUB_PRESETS: SmartPreset[] = [
  {
    id: 'epub-to-html',
    title: '→ HTML 页面',
    description: '将 EPUB 电子书导出为 HTML，方便在浏览器阅读或归档。',
    outputFormat: 'html',
    params: [{ id: 'standalone', value: true }],
    tags: ['推荐', '零依赖', '阅读'],
  },
  {
    id: 'epub-to-md',
    title: '→ Markdown',
    description: '将 EPUB 内容提取为 Markdown，适合迁移到 Obsidian 等笔记软件。',
    outputFormat: 'markdown',
    params: [{ id: 'wrap', value: 'preserve' }],
    tags: ['零依赖', '笔记迁移'],
  },
  {
    id: 'epub-to-docx',
    title: '→ Word 文档',
    description: '将 EPUB 转为可编辑的 Word 文档，适合需要修改排版的场景。',
    outputFormat: 'docx',
    params: [],
    tags: ['零依赖'],
  },
]

// ---------------------------------------------------------------------------
// ODT presets
// ---------------------------------------------------------------------------
const ODT_PRESETS: SmartPreset[] = [
  {
    id: 'odt-to-md',
    title: '→ Markdown',
    description: '将 LibreOffice 文档转为 Markdown，适合迁移到知识库。',
    outputFormat: 'markdown',
    params: [{ id: 'wrap', value: 'preserve' }],
    tags: ['推荐', '零依赖', 'LibreOffice'],
  },
  {
    id: 'odt-to-docx',
    title: '→ Word 文档',
    description: '将 OpenDocument 转为 Word 格式，方便在 Microsoft Office 中打开。',
    outputFormat: 'docx',
    params: [],
    tags: ['零依赖', 'Office兼容'],
  },
  {
    id: 'odt-to-html',
    title: '→ HTML 页面',
    description: '将 OpenDocument 转为独立 HTML，适合网页发布或归档。',
    outputFormat: 'html',
    params: [{ id: 'standalone', value: true }],
    tags: ['零依赖'],
  },
]

// ---------------------------------------------------------------------------
// Master index
// ---------------------------------------------------------------------------
export const PRESETS_BY_FORMAT: Record<string, SmartPreset[]> = {
  markdown:   MARKDOWN_PRESETS,
  gfm:        MARKDOWN_PRESETS,
  commonmark: MARKDOWN_PRESETS,
  docx:       DOCX_PRESETS,
  html:       HTML_PRESETS,
  rst:        RST_PRESETS,
  tex:        LATEX_PRESETS,
  latex:      LATEX_PRESETS,
  epub:       EPUB_PRESETS,
  odt:        ODT_PRESETS,
}

export function getPresetsForFormat(inputFormat: string): SmartPreset[] {
  return PRESETS_BY_FORMAT[inputFormat.toLowerCase()] ?? []
}
