/**
 * 基础四维向量接口
 */
export interface Vector4 {
  x: number;
  y: number;
  z: number;
  w: number;
}

/**
 * 边定义：存储两个顶点的索引
 */
export interface Edge {
  start: number;
  end: number;
}

/**
 * 四维物体数据定义
 */
export interface HyperObject {
  name: string;
  vertices: Vector4[];
  edges: Edge[];
}
