# PanView

<div align="center">

![PanView](https://img.shields.io/badge/PanView-v0.1.0-blue?style=flat-square)
![Electron](https://img.shields.io/badge/Electron-28-green?style=flat-square)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

**现代化 Pandoc 图形界面工具 | A Modern GUI for Pandoc Document Conversion**

[English](#english) | [中文](#中文)

---

## ✨ 特性 / Features

### 核心功能 / Core Features

- � **拖拽转换** - 简单拖拽文件即可开始转换
- � **多格式支持** - 支持 Markdown、HTML、DOCX、PDF、EPUB 等多种格式
- ⚙️ **丰富参数** - 灵活的 Pandoc 参数配置
- � **批量处理** - 支持多个文件同时转换
- 💾 **智能记忆** - 自动记住上次使用的设置和路径

### 用户体验 / User Experience

- 🎨 **现代设计** - 玻璃拟态视觉风格，深色/浅色主题
- 🚀 **快速响应** - 流畅的动画和交互体验
- 🔧 **一键配置** - 直观的设置面板，无需复杂配置
- 🌐 **跨平台** - 支持 Windows、macOS、Linux

## 📥 下载 / Download

### 最新版本 / Latest Release

| 平台    | 下载链接                                                         |
| ------- | ---------------------------------------------------------------- |
| Windows | [PanView Setup 0.1.0.exe](./release/PanView%20Setup%200.1.0.exe) |
| macOS   | 即将支持                                                         |
| Linux   | 即将支持                                                         |

### 便携版 / Portable

- [Windows Portable](./release/win-unpacked/PanView.exe)

## 🚀 快速开始 / Quick Start

### 开发模式 / Development

```bash
# 克隆项目
git clone https://github.com/rippleshe/PanView.git
cd PanView

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 构建安装包 / Build

```bash
# 构建 Windows 安装包
npm run dist:win

# 构建 macOS 安装包
npm run dist:mac

# 构建 Linux 安装包
npm run dist:linux

# 构建所有平台
npm run dist
```

## 📖 使用指南 / User Guide

### 1. 基本转换流程

1. **添加文件** - 拖拽或点击选择要转换的文件
2. **选择格式** - 设定输入和输出格式
3. **配置参数**（可选）- 添加额外的 Pandoc 参数
4. **开始转换** - 点击转换按钮

### 2. 配置 Pandoc 路径

如果系统没有安装 Pandoc 或想使用特定版本：

1. 在底部**设置面板**中点击 Pandoc 路径的**浏览**按钮
2. 选择 `pandoc.exe` 文件
3. 路径会自动保存

### 3. 设置默认输出目录

1. 在底部**设置面板**中点击默认输出目录的**浏览**按钮
2. 选择目标文件夹
3. 转换后的文件将自动保存到该目录

## 🛠️ 技术栈 / Tech Stack

- **Electron 28** - 跨平台桌面应用框架
- **React 18** - 前端 UI 框架
- **TypeScript 5** - 类型安全的 JavaScript
- **Vite 5** - 现代化构建工具
- **Tailwind CSS 3** - 原子化 CSS 框架
- **Zustand** - 轻量级状态管理
- **Ant Design** - 企业级 UI 组件库

## 📁 项目结构 / Project Structure

```
PanView/
├── src/
│   ├── main/           # Electron 主进程
│   │   ├── index.ts    # 入口文件
│   │   ├── window.ts   # 窗口管理
│   │   └── handlers/   # IPC 处理器
│   │       ├── file.ts    # 文件操作
│   │       └── pandoc.ts  # Pandoc 执行
│   ├── preload/        # 预加载脚本
│   └── renderer/       # React 渲染进程
│       ├── components/ # UI 组件
│       ├── stores/     # 状态管理
│       ├── utils/      # 工具函数
│       └── types/      # 类型定义
├── release/            # 构建输出
├── package.json
└── electron.vite.config.ts
```

## 🤝 贡献 / Contributing

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📝 许可证 / License

本项目基于 MIT 许可证开源 - 查看 [LICENSE](LICENSE) 文件详情。

## 🙏 致谢 / Acknowledgments

- [Pandoc](https://pandoc.org/) - 强大的文档转换工具
- [Electron](https://www.electronjs.org/) - 跨平台桌面应用框架
- [React](https://react.dev/) - 声明式 UI 库
- 所有开源库的贡献者

---

## English

### About PanView

PanView is a modern, user-friendly GUI application for [Pandoc](https://pandoc.org/), the universal document converter. It provides an intuitive interface for document conversion without needing to use command-line tools.

### Key Features

- **Drag & Drop Conversion** - Simply drag files to convert
- **Multi-format Support** - Markdown, HTML, DOCX, PDF, EPUB, and more
- **Rich Parameters** - Flexible Pandoc parameter configuration
- **Batch Processing** - Convert multiple files at once
- **Smart Memory** - Automatically remembers your settings

### Tech Stack

- Electron 28 + React 18 + TypeScript 5
- Vite 5 + Tailwind CSS 3
- Zustand for state management
- Ant Design for UI components

---

## 中文

### 关于 PanView

PanView 是一款现代化、用户友好的 [Pandoc](https://pandoc.org/) 图形界面工具。它提供了直观的界面，让用户无需使用命令行即可完成文档转换。

### 主要特性

- 拖拽转换 - 简单拖拽文件即可开始
- 多格式支持 - Markdown、HTML、DOCX、PDF、EPUB 等
- 丰富参数 - 灵活的 Pandoc 参数配置
- 批量处理 - 支持多文件同时转换
- 智能记忆 - 自动记住上次使用的设置

### 技术栈

- Electron 28 + React 18 + TypeScript 5
- Vite 5 + Tailwind CSS 3
- Zustand 状态管理
- Ant Design UI 组件库

---

<div align="center">

Made with ❤️ by [rippleshe](https://github.com/rippleshe)

</div>
