# Hyper-Viewer 4D

基于 TypeScript 开发的虚拟四维体展示工具。

## 核心理念
通过数学变换将四维空间物体投影至三维空间，此时的四维体可以当作静止的三维体进行处理，并利用 Three.js 进行渲染。

**核心流程：** 
4D 原始数据 -> 4D 空间变换 (Rotation) -> 投影至 3D 空间 (Projection) -> Three.js 渲染。

## 架构原则
- **src/core**: 4D 数学矩阵运算与模型定义（无 DOM/Three.js 依赖）。
- **src/engine**: 负责 3D 场景渲染。
- **单向依赖**: `engine` -> `core`。

## 模型定义

- 顶点 (vertices): 定义了超正方体在 4D 空间中的 16 个顶点坐标 (x, y, z, w)

- 边 (edges): 定义了连接这些顶点的 32 条边，描述了超正方体的结构

- 通过这些顶点和边的信息，HyperMesh 类能够在 4D 空间中表示和操作超正方体，并将其投影到 3D 空间进行渲染。

- 该模型允许用户在 4D 空间中旋转和查看超正方体的不同投影视图。

- 目前使用的模型是标准的超立方体，适用于 4D 图形学和可视化应用。

- 替换`src/main.ts`的 Tesseract 模型即可加载不同的模型。

## 技术栈
- TypeScript
- Three.js
- Vite

## 预览与部署

### 1. 静态构建预览

在本地构建项目并使用静态服务器预览生产版本：
```bash
npm run build
npx serve dist
```

或是直接启用虚拟服务器

```bash
npm run dev
```
