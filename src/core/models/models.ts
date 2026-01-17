import { HyperObject } from '../types';

/**
 * 超正方体
 * 包含 16 个顶点，32 条边
 */
export const Tesseract: HyperObject = {
  name: '超正方体Tesseract',
  vertices: [
    { x: -1, y: -1, z: -1, w: -1 }, { x: 1, y: -1, z: -1, w: -1 },
    { x: 1, y: 1, z: -1, w: -1 }, { x: -1, y: 1, z: -1, w: -1 },
    { x: -1, y: -1, z: 1, w: -1 }, { x: 1, y: -1, z: 1, w: -1 },
    { x: 1, y: 1, z: 1, w: -1 }, { x: -1, y: 1, z: 1, w: -1 },
    { x: -1, y: -1, z: -1, w: 1 }, { x: 1, y: -1, z: -1, w: 1 },
    { x: 1, y: 1, z: -1, w: 1 }, { x: -1, y: 1, z: -1, w: 1 },
    { x: -1, y: -1, z: 1, w: 1 }, { x: 1, y: -1, z: 1, w: 1 },
    { x: 1, y: 1, z: 1, w: 1 }, { x: -1, y: 1, z: 1, w: 1 }
  ],
  edges: [
    // 内部 3D 立方体 1
    { start: 0, end: 1 }, { start: 1, end: 2 }, { start: 2, end: 3 }, { start: 3, end: 0 },
    { start: 4, end: 5 }, { start: 5, end: 6 }, { start: 6, end: 7 }, { start: 7, end: 4 },
    { start: 0, end: 4 }, { start: 1, end: 5 }, { start: 2, end: 6 }, { start: 3, end: 7 },
    // 外部 3D 立方体 2
    { start: 8, end: 9 }, { start: 9, end: 10 }, { start: 10, end: 11 }, { start: 11, end: 8 },
    { start: 12, end: 13 }, { start: 13, end: 14 }, { start: 14, end: 15 }, { start: 15, end: 12 },
    { start: 8, end: 12 }, { start: 9, end: 13 }, { start: 10, end: 14 }, { start: 11, end: 15 },
    // 连接两个立方体的 4D 边
    { start: 0, end: 8 }, { start: 1, end: 9 }, { start: 2, end: 10 }, { start: 3, end: 11 },
    { start: 4, end: 12 }, { start: 5, end: 13 }, { start: 6, end: 14 }, { start: 7, end: 15 }
  ]
};

/**
 * 五胞体 (Pentachoron)
 * 包含 5 个顶点，10 条边
 * 这是 4D 空间中的单纯形 (Simplex)
 */
const S5 = 1 / Math.sqrt(5);
export const Pentachoron: HyperObject = {
  name: '五胞体Pentachoron',
  vertices: [
    { x: 1, y: 1, z: 1, w: -S5 },
    { x: 1, y: -1, z: -1, w: -S5 },
    { x: -1, y: 1, z: -1, w: -S5 },
    { x: -1, y: -1, z: 1, w: -S5 },
    { x: 0, y: 0, z: 0, w: 4 * S5 }
  ],
  edges: [
    { start: 0, end: 1 }, { start: 0, end: 2 }, { start: 0, end: 3 }, { start: 0, end: 4 },
    { start: 1, end: 2 }, { start: 1, end: 3 }, { start: 1, end: 4 },
    { start: 2, end: 3 }, { start: 2, end: 4 },
    { start: 3, end: 4 }
  ]
};

export const hyper_objects = [Tesseract, Pentachoron];
