import { Vector4 } from '../types';

/**
 * 4D 矩阵旋转与数学工具库
 */
export class Math4D {
    /**
     * 生成旋转矩阵 (绕 XW 平面)
     * 在四维空间中，旋转是绕着一个“平面”而不是一个“轴”进行的
     */
    static getRotationXW(theta: number): number[][] {
        const c = Math.cos(theta);
        const s = Math.sin(theta);
        return [
            [c, 0, 0, -s],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [s, 0, 0, c]
        ];
    }

    /**
     * 生成旋转矩阵 (绕 YW 平面)
     */
    static getRotationYW(theta: number): number[][] {
        const c = Math.cos(theta);
        const s = Math.sin(theta);
        return [
            [1, 0, 0, 0],
            [0, c, 0, -s],
            [0, 0, 1, 0],
            [0, s, 0, c]
        ];
    }

    /**
     * 生成旋转矩阵 (绕 ZW 平面)
     */
    static getRotationZW(theta: number): number[][] {
        const c = Math.cos(theta);
        const s = Math.sin(theta);
        return [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, c, -s],
            [0, s, 0, c]
        ];
    }

    /**
     * 矩阵与向量相乘
     */
    static multiplyMatrixVector(m: number[][], v: Vector4): Vector4 {
        return {
            x: m[0][0] * v.x + m[0][1] * v.y + m[0][2] * v.z + m[0][3] * v.w,
            y: m[1][0] * v.x + m[1][1] * v.y + m[1][2] * v.z + m[1][3] * v.w,
            z: m[2][0] * v.x + m[2][1] * v.y + m[2][2] * v.z + m[2][3] * v.w,
            w: m[3][0] * v.x + m[3][1] * v.y + m[3][2] * v.z + m[3][3] * v.w
        };
    }

    /**
     * 4D 到 3D 的透视投影
     * @param v4 四维顶点
     * @param distance 相机到 4D 物体的距离
     */
    static projectTo3D(v4: Vector4, distance: number = 2): { x: number, y: number, z: number } {
        // 透视因子：w 轴坐标越大，投影后的 3D 尺寸越大（类似 3D 透视中的 z）
        const w = 1 / (distance - v4.w);
        return {
            x: v4.x * w,
            y: v4.y * w,
            z: v4.z * w
        };
    }
}
