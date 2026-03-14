<div align="center">

<img src="PanView.ico" alt="PanView Logo" width="80" />

# PanView

**现代化 Pandoc 图形界面工具**

A Modern GUI for Pandoc Document Conversion

[![Version](https://img.shields.io/github/v/release/rippleshe/PanView?style=flat-square&color=4f46e5)](https://github.com/rippleshe/PanView/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-blue?style=flat-square)](https://github.com/rippleshe/PanView/releases)
[![Electron](https://img.shields.io/badge/Electron-28-47848f?style=flat-square&logo=electron)](https://www.electronjs.org/)
[![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react)](https://react.dev/)

[下载](#-下载) · [快速开始](#-快速开始) · [开发](#-开发)

---

</div>

## 📖 简介

PanView 是一个为 [Pandoc](https://pandoc.org) 提供图形化界面的跨平台桌面应用。  
无需记忆复杂的命令行参数，拖拽文件即可完成格式转换。

## ✨ 特性

| 功能 | 描述 |
|------|------|
| 🖱️ **拖拽转换** | 直接拖拽文件到窗口即可开始转换 |
| 📄 **多格式支持** | 支持 Markdown、HTML、DOCX、PDF、EPUB 等 15+ 种格式 |
| ⚙️ **参数配置** | 可视化配置所有 Pandoc 参数，实时预览生成的命令 |
| 📦 **批量处理** | 支持多个文件同时转换 |
| 🧠 **智能记忆** | 自动保存上次使用的设置、路径和参数 |
| 🎨 **现代设计** | 玻璃拟态风格 UI，支持深色 / 浅色主题切换 |
| 🖥️ **跨平台** | 原生支持 Windows、macOS、Linux |


## 📥 下载

前往 [**GitHub Releases**](https://github.com/rippleshe/PanView/releases) 下载最新版本：

| 平台 | 安装包 | 说明 |
|------|--------|------|
| 🪟 Windows | `PanView Setup x.x.x.exe` | NSIS 安装程序，x64 |
| 🍎 macOS | `PanView-x.x.x.dmg` | DMG 磁盘镜像，支持 Intel & Apple Silicon |
| 🐧 Linux | `PanView-x.x.x.AppImage` | AppImage，x64，免安装直接运行 |

> **Windows 便携版**：解压 Release 附件中的 `win-unpacked.zip`，直接运行 `PanView.exe`，无需安装。

### 前置依赖

使用 PanView 需要先安装 **Pandoc**：

- **Windows**：[官网下载](https://pandoc.org/installing.html) 或 `winget install JohnMacFarlane.Pandoc`
- **macOS**：`brew install pandoc`
- **Linux**：`sudo apt install pandoc` / `sudo dnf install pandoc`

安装后 PanView 会自动检测系统 PATH 中的 Pandoc，也可以在设置中手动指定路径。

---

## 🚀 快速开始

### 1. 添加文件

拖拽文件到主窗口，或点击 **选择文件** 按钮。支持同时添加多个文件进行批量转换。

### 2. 选择格式

在下拉菜单中选择输入格式（通常会自动识别）和目标输出格式。

### 3. 配置参数（可选）

展开 **参数面板** 可添加额外的 Pandoc 参数，右侧实时预览最终执行的完整命令。

### 4. 开始转换

点击 **转换** 按钮，转换结果将保存到原文件目录（或在设置中指定的默认输出目录）。

### 配置默认输出目录

在底部 **设置面板** → 默认输出目录 → 点击 **浏览** 选择文件夹，设置会自动持久化保存。

### 指定 Pandoc 路径

如需使用特定版本的 Pandoc：设置面板 → Pandoc 路径 → 点击 **浏览** 选择可执行文件。

---

## 🛠️ 开发

### 环境要求

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Pandoc** >= 2.0（运行时依赖）

### 本地运行

```bash
# 克隆项目
git clone https://github.com/rippleshe/PanView.git
cd PanView

# 安装依赖
npm install

# 启动开发服务器（支持热更新）
npm run dev
```

### 构建

```bash
# 仅编译（不打包）
npm run build

# 打包当前平台
npm run dist

# 指定平台打包
npm run dist:win    # Windows (.exe)
npm run dist:mac    # macOS (.dmg)  — 需在 macOS 上运行
npm run dist:linux  # Linux (.AppImage)
```

> **注意**：macOS 和 Linux 安装包需要在对应平台上构建，或通过 GitHub Actions 自动构建（推送 `v*` tag 即可触发）。

---

## 🏗️ 技术栈

| 层级 | 技术 |
|------|------|
| 桌面框架 | Electron 28 |
| 前端框架 | React 18 + TypeScript 5 |
| 构建工具 | Vite 5 + electron-vite |
| 打包工具 | electron-builder |
| UI 组件 | Ant Design 5 |
| 样式 | Tailwind CSS 3 |
| 状态管理 | Zustand |
| 动画 | Framer Motion |

---

## 📁 项目结构

```
PanView/
├── src/
│   ├── main/               # Electron 主进程
│   │   ├── index.ts        # 应用入口 & 生命周期
│   │   ├── window.ts       # 窗口管理
│   │   └── handlers/       # IPC 处理器
│   │       ├── file.ts     # 文件选择 & 操作
│   │       └── pandoc.ts   # Pandoc 调用 & 执行
│   ├── preload/            # 预加载脚本（安全桥接）
│   └── renderer/           # React 渲染进程
│       ├── components/     # UI 组件
│       ├── stores/         # Zustand 状态
│       ├── hooks/          # 自定义 Hooks
│       ├── utils/          # 工具函数
│       └── types/          # TypeScript 类型定义
├── build/                  # 构建资源（图标等）
├── release/                # 打包输出目录
├── .github/workflows/      # CI/CD 自动构建
└── electron.vite.config.ts
```

---

## 📄 许可证

本项目基于 [MIT License](LICENSE) 开源，欢迎自由使用和二次开发。

---

<div align="center">

如果这个项目对你有帮助，欢迎点个 ⭐ Star！

</div>
