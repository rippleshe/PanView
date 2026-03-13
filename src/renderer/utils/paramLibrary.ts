import type { PandocParam, FormatOption } from '../types/app'

export const PANDOC_PARAMS: PandocParam[] = [
  {
    id: 'toc',
    name: '--toc',
    description: '生成文档目录',
    category: '文档结构',
    type: 'boolean',
    defaultValue: false
  },
  {
    id: 'toc-depth',
    name: '--toc-depth',
    description: '目录显示的标题层级深度',
    category: '文档结构',
    type: 'number',
    defaultValue: 3,
    min: 1,
    max: 6
  },
  {
    id: 'number-sections',
    name: '--number-sections',
    description: '为章节标题添加编号',
    category: '文档结构',
    type: 'boolean',
    defaultValue: false
  },
  {
    id: 'standalone',
    name: '--standalone',
    description: '生成完整文档（包含头部信息）',
    category: '格式控制',
    type: 'boolean',
    defaultValue: false
  },
  {
    id: 'self-contained',
    name: '--self-contained',
    description: '生成自包含文档（内嵌CSS/JS）',
    category: '格式控制',
    type: 'boolean',
    defaultValue: false
  },
  {
    id: 'template',
    name: '--template',
    description: '使用自定义模板',
    category: '模板',
    type: 'path',
    defaultValue: ''
  },
  {
    id: 'pdf-engine',
    name: '--pdf-engine',
    description: '指定PDF生成引擎',
    category: 'PDF',
    type: 'select',
    options: [
      { label: 'pdflatex', value: 'pdflatex' },
      { label: 'xelatex', value: 'xelatex' },
      { label: 'lualatex', value: 'lualatex' },
      { label: 'wkhtmltopdf', value: 'wkhtmltopdf' },
      { label: 'weasyprint', value: 'weasyprint' }
    ],
    defaultValue: 'pdflatex'
  },
  {
    id: 'highlight-style',
    name: '--highlight-style',
    description: '代码高亮样式',
    category: '代码',
    type: 'select',
    options: [
      { label: 'pygments', value: 'pygments' },
      { label: 'kate', value: 'kate' },
      { label: 'monochrome', value: 'monochrome' },
      { label: 'espresso', value: 'espresso' },
      { label: 'haddock', value: 'haddock' },
      { label: 'tango', value: 'tango' },
      { label: 'zenburn', value: 'zenburn' }
    ],
    defaultValue: 'pygments'
  },
  {
    id: 'smart',
    name: '--smart',
    description: '智能标点符号处理',
    category: '格式控制',
    type: 'boolean',
    defaultValue: false
  },
  {
    id: 'wrap',
    name: '--wrap',
    description: '文本换行方式',
    category: '格式控制',
    type: 'select',
    options: [
      { label: '自动换行', value: 'auto' },
      { label: '不换行', value: 'none' },
      { label: '保留', value: 'preserve' }
    ],
    defaultValue: 'auto'
  },
  {
    id: 'columns',
    name: '--columns',
    description: '每行字符数',
    category: '格式控制',
    type: 'number',
    defaultValue: 72,
    min: 40,
    max: 120
  },
  {
    id: 'variable',
    name: '--variable',
    description: '设置模板变量',
    category: '模板',
    type: 'string',
    defaultValue: ''
  },
  {
    id: 'metadata',
    name: '--metadata',
    description: '设置文档元数据',
    category: '文档结构',
    type: 'string',
    defaultValue: ''
  },
  {
    id: 'include-in-header',
    name: '--include-in-header',
    description: '在头部包含文件',
    category: '模板',
    type: 'path',
    defaultValue: ''
  },
  {
    id: 'include-before-body',
    name: '--include-before-body',
    description: '在正文前包含文件',
    category: '模板',
    type: 'path',
    defaultValue: ''
  },
  {
    id: 'include-after-body',
    name: '--include-after-body',
    description: '在正文后包含文件',
    category: '模板',
    type: 'path',
    defaultValue: ''
  },
  {
    id: 'citeproc',
    name: '--citeproc',
    description: '处理引用和参考文献',
    category: '引用',
    type: 'boolean',
    defaultValue: false
  },
  {
    id: 'bibliography',
    name: '--bibliography',
    description: '参考文献数据库文件',
    category: '引用',
    type: 'path',
    defaultValue: ''
  },
  {
    id: 'csl',
    name: '--csl',
    description: '引用样式文件',
    category: '引用',
    type: 'path',
    defaultValue: ''
  },
  {
    id: 'reference-doc',
    name: '--reference-doc',
    description: '参考文档（用于样式）',
    category: '模板',
    type: 'path',
    defaultValue: ''
  },
  {
    id: 'data-dir',
    name: '--data-dir',
    description: '数据目录',
    category: '其他',
    type: 'path',
    defaultValue: ''
  },
  {
    id: 'extract-media',
    name: '--extract-media',
    description: '提取媒体文件到指定目录',
    category: '其他',
    type: 'path',
    defaultValue: ''
  },
  {
    id: 'fail-if-warnings',
    name: '--fail-if-warnings',
    description: '有警告时失败',
    category: '其他',
    type: 'boolean',
    defaultValue: false
  },
  {
    id: 'quiet',
    name: '--quiet',
    description: '静默模式',
    category: '其他',
    type: 'boolean',
    defaultValue: false
  }
]

export const OUTPUT_FORMATS: FormatOption[] = [
  { label: 'Word Document', value: 'docx', extension: 'docx', description: 'Microsoft Word 文档' },
  { label: 'PDF', value: 'pdf', extension: 'pdf', description: '便携式文档格式' },
  { label: 'HTML', value: 'html', extension: 'html', description: '超文本标记语言' },
  { label: 'Markdown', value: 'md', extension: 'md', description: 'Markdown 文档' },
  { label: 'Plain Text', value: 'txt', extension: 'txt', description: '纯文本' },
  { label: 'LaTeX', value: 'tex', extension: 'tex', description: 'LaTeX 文档' },
  { label: 'EPUB', value: 'epub', extension: 'epub', description: '电子书格式' },
  { label: 'OpenDocument', value: 'odt', extension: 'odt', description: 'OpenDocument 文本' },
  { label: 'ReStructuredText', value: 'rst', extension: 'rst', description: 'ReStructuredText 文档' },
  { label: 'Textile', value: 'textile', extension: 'textile', description: 'Textile 文档' },
  { label: 'MediaWiki', value: 'mediawiki', extension: 'wiki', description: 'MediaWiki 标记' },
  { label: 'Slide Show', value: 'beamer', extension: 'pdf', description: 'LaTeX Beamer 演示文稿' },
  { label: 'OPML', value: 'opml', extension: 'opml', description: '大纲处理标记语言' },
  { label: 'DocBook', value: 'docbook', extension: 'xml', description: 'DocBook XML' },
  { label: 'DokuWiki', value: 'dokuwiki', extension: 'txt', description: 'DokuWiki 标记' }
]

export const PARAM_CATEGORIES = [
  '全部',
  '最近',
  '文档结构',
  '格式控制',
  'PDF',
  '代码',
  '引用',
  '模板',
  '其他'
]

export const FORMAT_MAP: Record<string, string> = {
  '.md': 'markdown',
  '.markdown': 'markdown',
  '.html': 'html',
  '.htm': 'html',
  '.docx': 'docx',
  '.pdf': 'pdf',
  '.txt': 'txt',
  '.rst': 'rst',
  '.tex': 'tex',
  '.epub': 'epub',
  '.odt': 'odt',
  '.pptx': 'pptx'
}

export function getParamsByCategory(category: string): PandocParam[] {
  if (category === '全部' || category === '最近') {
    return PANDOC_PARAMS
  }
  return PANDOC_PARAMS.filter(param => param.category === category)
}

export function searchParams(query: string): PandocParam[] {
  const lowerQuery = query.toLowerCase()
  return PANDOC_PARAMS.filter(param => 
    param.name.toLowerCase().includes(lowerQuery) ||
    param.description.toLowerCase().includes(lowerQuery)
  )
}

export function getParamById(id: string): PandocParam | undefined {
  return PANDOC_PARAMS.find(param => param.id === id)
}
