# PanView

## 项目概述

PanView 是一个为 Pandoc 提供图形化界面的桌面应用，让用户无需记忆命令行参数即可完成文档格式转换。

## 核心功能

1. **文件选择** - 支持拖拽和文件选择器
2. **格式转换** - 支持 15+ 种输出格式
3. **参数配置** - 可视化配置 Pandoc 参数
4. **命令预览** - 实时预览生成的命令
5. **一键转换** - 简单点击即可完成转换

## 技术架构

### 前端
- React 18 + TypeScript
- Ant Design UI 组件库
- Zustand 状态管理
- Framer Motion 动画
- Lucide React 图标

### 后端
- Electron 桌面框架
- electron-vite 构建工具
- IPC 进程间通信
- electron-store 配置持久化

### 构建工具
- Vite 快速构建
- electron-builder 应用打包
- TypeScript 类型检查

## 项目结构

```
PanView/
├── src/
│   ├── main/              # Electron 主进程
│   ├── preload/           # 预加载脚本
│   └── renderer/          # React 渲染进程
├── build/                 # 构建资源
├── out/                   # 编译输出
└── release/               # 打包输出
```

## 开发指南

详见 [DEVELOPMENT.md](./DEVELOPMENT.md)

## 安装和运行

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建应用
npm run build

# 打包应用
npm run dist
```

## 依赖要求

- Node.js >= 18.0.0
- Pandoc >= 2.0

## 许可证

MIT License
