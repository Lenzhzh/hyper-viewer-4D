import * as THREE from 'three';
import { HyperObject } from '../core/types';
import { Math4D } from '../core/math/Math4D';

/**
    * HyperMesh 负责将四维物体数据转换为 Three.js 可渲染的三维网格
    * 静止四维物体的三维投影在可以视为一个静止的三维物体
    * 通过旋转角度的变化，可以实现四维物体在三维空间中的动态展示
 */
export class HyperMesh {
    private lineGeometry: THREE.BufferGeometry;
    private pointsGeometry: THREE.BufferGeometry;
    private group: THREE.Group;
    private sourceData: HyperObject;
    
    // 4D 旋转角度
    public rotationXW: number = 0;
    public rotationYW: number = 0;
    public rotationZW: number = 0;
    public rotation3D: THREE.Euler = new THREE.Euler();
    public projectionDistance: number = 2.0;

    private lastProjectedVertices: { x: number, y: number, z: number }[] = [];

    constructor(data: HyperObject) {
        this.sourceData = data;
        this.group = new THREE.Group();
        
        this.lineGeometry = new THREE.BufferGeometry();
        this.pointsGeometry = new THREE.BufferGeometry();
        
        // 1. 线材质
        const lineMaterial = new THREE.LineBasicMaterial({ 
            color: 0x00ffcc,
            transparent: true,
            opacity: 1,
        });

        // 2. 顶点材质
        const pointMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.1,             // 点大小
        });

        const lineSegments = new THREE.LineSegments(this.lineGeometry, lineMaterial);
        const points = new THREE.Points(this.pointsGeometry, pointMaterial);

        this.group.add(lineSegments);
        this.group.add(points);

        this.update();
    }

    /*
     * 更新四维物体的三维投影 
     */
    public update() {
        const mXW = Math4D.getRotationXW(this.rotationXW);
        const mYW = Math4D.getRotationYW(this.rotationYW);
        const mZW = Math4D.getRotationZW(this.rotationZW);

        // 4D 投影到 3D 空间
        this.lastProjectedVertices = this.sourceData.vertices.map(v4 => {
            let rv = Math4D.multiplyMatrixVector(mXW, v4);
            rv = Math4D.multiplyMatrixVector(mYW, rv);
            rv = Math4D.multiplyMatrixVector(mZW, rv);
            return Math4D.projectTo3D(rv, this.projectionDistance);
        });

        // 应用 3D 空间旋转
        this.group.rotation.copy(this.rotation3D);

        // 更新顶点位置
        const pointsPositions: number[] = [];
        for (const p of this.lastProjectedVertices) {
            pointsPositions.push(p.x, p.y, p.z);
        }
        this.pointsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(pointsPositions, 3));
        this.pointsGeometry.attributes.position.needsUpdate = true;

        // 更新线段位置
        const linePositions: number[] = [];
        for (const edge of this.sourceData.edges) {
            const p1 = this.lastProjectedVertices[edge.start];
            const p2 = this.lastProjectedVertices[edge.end];
            linePositions.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
        }
        this.lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
        this.lineGeometry.attributes.position.needsUpdate = true;
    }

    public getObject(): THREE.Group {
        return this.group;
    }

    /*
     * 获取指定顶点信息。
     */
    public getVertexInfo(index: number) {
        if (index < 0 || index >= this.sourceData.vertices.length) return null;
        return {
            v4: this.sourceData.vertices[index],
            v3: this.lastProjectedVertices[index]
        };
    }
}
