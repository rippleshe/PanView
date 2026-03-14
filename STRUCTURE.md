# PanView 项目文件结构

```
PanView/
│
├── src/                          # 源代码目录
│   ├── main/                     # Electron 主进程
│   │   ├── index.ts             # 主进程入口文件
│   │   ├── window.ts            # 窗口创建和配置
│   │   └── handlers/            # IPC 通信处理器
│   │       ├── pandoc.ts        # Pandoc 检测和执行
│   │       └── file.ts          # 文件选择对话框
│   │
│   ├── preload/                  # 预加载脚本
│   │   └── index.ts             # 暴露 API 给渲染进程
│   │
│   └── renderer/                 # 渲染进程（React 应用）
│       ├── main.tsx             # React 应用入口
│       ├── App.tsx              # 主应用组件
│       ├── index.html           # HTML 模板
│       │
│       ├── components/          # UI 组件
│       │   ├── Header.tsx       # 顶部导航栏
│       │   ├── Header.css
│       │   ├── FileDropZone.tsx # 文件拖拽区域
│       │   ├── FileDropZone.css
│       │   ├── FormatSelector.tsx # 格式选择器
│       │   ├── FormatSelector.css
│       │   ├── ParamList.tsx    # 参数列表
│       │   ├── ParamList.css
│       │   ├── CommandPreview.tsx # 命令预览
│       │   └── CommandPreview.css
│       │
│       ├── stores/              # Zustand 状态管理
│       │   └── useAppStore.ts   # 全局应用状态
│       │
│       ├── hooks/               # 自定义 React Hooks
│       │   ├── usePandoc.ts     # Pandoc 相关操作
│       │   └── useFileSelection.ts # 文件选择操作
│       │
│       ├── utils/               # 工具函数
│       │   ├── paramLibrary.ts  # Pandoc 参数库
│       │   └── commandGenerator.ts # 命令生成器
│       │
│       ├── types/               # TypeScript 类型定义
│       │   ├── electron.d.ts    # Electron API 类型
│       │   └── app.ts           # 应用类型定义
│       │
│       └── styles/              # 全局样式
│           ├── index.css        # 基础样式
│           └── App.css         # 应用样式
│
├── build/                       # 构建资源
│   └── README.md               # 图标文件说明
│
├── out/                         # 编译输出目录（自动生成）
│   ├── main/                   # 主进程编译输出
│   ├── preload/                # 预加载脚本编译输出
│   └── renderer/               # 渲染进程编译输出
│
├── release/                     # 打包输出目录（自动生成）
│   ├── PanView-0.1.0-win.exe   # Windows 安装包
│   ├── PanView-0.1.0-mac.dmg   # macOS 安装包
│   └── PanView-0.1.0-linux.AppImage # Linux 安装包
│
├── package.json                 # 项目配置和依赖
├── tsconfig.json                # TypeScript 配置
├── tsconfig.node.json           # Node.js TypeScript 配置
├── electron.vite.config.ts      # Electron Vite 配置
├── .gitignore                  # Git 忽略文件
│
├── README.md                    # 项目说明文档
├── DEVELOPMENT.md              # 开发指南
├── PROJECT.md                   # 项目概述
├── UIdesign.txt                # UI 设计文档
└── STRUCTURE.md                # 本文件 - 项目结构说明
```

## 核心文件说明

### 配置文件

- **package.json** - 项目元数据、依赖、脚本命令
- **tsconfig.json** - TypeScript 编译配置
- **electron.vite.config.ts** - Vite 构建配置
- **.gitignore** - Git 忽略规则

### 主进程文件

- **src/main/index.ts** - 应用启动、生命周期管理
- **src/main/window.ts** - 窗口创建、配置、事件处理
- **src/main/handlers/pandoc.ts** - Pandoc 检测、命令执行
- **src/main/handlers/file.ts** - 文件选择对话框处理

### 预加载脚本

- **src/preload/index.ts** - 安全暴露 API 给渲染进程

### 渲染进程文件

- **src/renderer/main.tsx** - React 应用入口
- **src/renderer/App.tsx** - 主应用组件
- **src/renderer/index.html** - HTML 模板

### 组件文件

- **Header.tsx** - 顶部导航栏（Logo、设置、关于按钮）
- **FileDropZone.tsx** - 文件拖拽选择区域
- **FormatSelector.tsx** - 输出格式选择器
- **ParamList.tsx** - Pandoc 参数配置列表
- **CommandPreview.tsx** - 命令预览和转换按钮

### 状态管理

- **useAppStore.ts** - 全局应用状态（Zustand）

### 工具函数

- **paramLibrary.ts** - Pandoc 参数库（25+ 参数）
- **commandGenerator.ts** - 命令生成和格式化

### 自定义 Hooks

- **usePandoc.ts** - Pandoc 操作封装
- **useFileSelection.ts** - 文件选择封装

### 类型定义

- **electron.d.ts** - Electron API 类型声明
- **app.ts** - 应用类型定义

## 目录结构特点

1. **清晰的分层** - main、preload、renderer 三个进程分离
2. **模块化组件** - 每个组件独立文件和样式
3. **集中管理** - stores、hooks、utils 分门别类
4. **类型安全** - 完整的 TypeScript 类型定义
5. **易于扩展** - 清晰的目录结构便于添加新功能

## 开发工作流

1. **修改主进程** - 编辑 `src/main/` 下的文件
2. **修改 UI** - 编辑 `src/renderer/components/` 下的组件
3. **添加状态** - 在 `useAppStore.ts` 中添加新的状态和方法
4. **添加工具** - 在 `utils/` 中添加新的工具函数
5. **添加类型** - 在 `types/` 中添加类型定义

## 构建流程

1. **开发模式** - `npm run dev` 启动热更新开发服务器
2. **构建** - `npm run build` 编译所有进程代码到 `out/` 目录
3. **打包** - `npm run dist` 使用 electron-builder 打包到 `release/` 目录

## 依赖关系

```
主进程 (main)
    ↓ IPC
预加载脚本 (preload)
    ↓ contextBridge
渲染进程 (renderer)
    ├── React 组件
    ├── Zustand Store
    ├── 自定义 Hooks
    └── 工具函数
```

## 关键技术点

1. **IPC 通信** - 主进程和渲染进程之间的安全通信
2. **Context Bridge** - 预加载脚本安全暴露 API
3. **状态管理** - Zustand 轻量级状态管理
4. **类型安全** - 完整的 TypeScript 类型系统
5. **构建优化** - Vite 快速构建和热更新
