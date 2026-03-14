# 开发指南

## 快速开始

1. 克隆项目
```bash
git clone <repository-url>
cd PanView
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm run dev
```

## 开发工作流

### 主进程开发

主进程代码位于 `src/main/` 目录：

- `index.ts` - 主进程入口，应用生命周期管理
- `window.ts` - 窗口创建和配置
- `handlers/` - IPC 通信处理器

添加新的 IPC 处理器：

```typescript
// src/main/handlers/yourHandler.ts
import { ipcMain } from 'electron'

export function registerYourHandler(): void {
  ipcMain.handle('your:action', async (event, arg) => {
    // 处理逻辑
    return { success: true, data: result }
  })
}

// 在 src/main/index.ts 中注册
import { registerYourHandler } from './handlers/yourHandler'

function onAppReady(): void {
  // ...
  registerYourHandler()
}
```

### 预加载脚本开发

预加载脚本位于 `src/preload/index.ts`，用于安全地暴露 API：

```typescript
const electronAPI = {
  yourFeature: {
    doSomething: (arg: string) => ipcRenderer.invoke('your:action', arg)
  }
}

contextBridge.exposeInMainWorld('electronAPI', electronAPI)
```

### 渲染进程开发

渲染进程使用 React + TypeScript：

#### 添加新组件

```typescript
// src/renderer/components/YourComponent.tsx
import React from 'react'
import { Card } from 'antd'
import './YourComponent.css'

export function YourComponent() {
  return (
    <Card className="your-component">
      {/* 组件内容 */}
    </Card>
  )
}
```

#### 使用状态管理

```typescript
import { useAppStore } from '../stores/useAppStore'

export function YourComponent() {
  const { someState, setSomeState } = useAppStore()
  
  return (
    <div onClick={() => setSomeState('new value')}>
      {someState}
    </div>
  )
}
```

#### 使用自定义 Hooks

```typescript
import { usePandoc } from '../hooks/usePandoc'

export function YourComponent() {
  const { pandocInfo, isConverting, convert } = usePandoc()
  
  return (
    <button onClick={convert}>
      转换
    </button>
  )
}
```

## 调试技巧

### 主进程调试

主进程的日志会显示在终端中，使用 `console.log` 输出调试信息。

### 渲染进程调试

开发模式下会自动打开 DevTools，可以使用 Chrome DevTools 进行调试。

### IPC 通信调试

在主进程和渲染进程中都添加日志：

```typescript
// 主进程
ipcMain.handle('your:action', async (event, arg) => {
  console.log('Received:', arg)
  const result = await process(arg)
  console.log('Result:', result)
  return result
})

// 渲染进程
const result = await window.electronAPI.yourFeature.doSomething(arg)
console.log('API Result:', result)
```

## 测试

### 单元测试

```bash
npm run test
```

### E2E 测试

```bash
npm run test:e2e
```

## 构建和打包

### 开发构建

```bash
npm run build
```

### 生产打包

```bash
# 当前平台
npm run dist

# 指定平台
npm run dist:win
npm run dist:mac
npm run dist:linux
```

打包后的文件位于 `release/` 目录。

## 性能优化

### 渲染进程优化

- 使用 React.memo 避免不必要的重渲染
- 使用 useMemo 和 useCallback 优化计算和函数
- 避免在渲染函数中创建新对象

### 主进程优化

- 避免在主进程中执行耗时操作
- 使用 Web Worker 处理复杂计算
- 合理使用缓存

## 常见问题

### 热更新不工作

确保使用 `npm run dev` 启动，而不是 `npm run build` 后手动运行。

### 类型错误

运行 TypeScript 检查：

```bash
npx tsc --noEmit
```

### 样式问题

确保 CSS 模块正确导入，检查类名冲突。

## 发布流程

1. 更新版本号
```bash
npm version patch/minor/major
```

2. 构建和测试
```bash
npm run build
npm run dist
```

3. 测试安装包
4. 提交代码和标签
5. 发布到 GitHub Releases

## 资源链接

- [Electron 文档](https://www.electronjs.org/docs)
- [React 文档](https://react.dev)
- [Ant Design 文档](https://ant.design)
- [Zustand 文档](https://github.com/pmndrs/zustand)
- [Pandoc 文档](https://pandoc.org/MANUAL.html)
