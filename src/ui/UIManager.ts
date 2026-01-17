import GUI from 'lil-gui';
import { HyperMesh } from '../engine/HyperMesh';
import * as THREE from 'three';
import { SceneManager } from '../engine/SceneManager';
import * as models from '../core/models/models';

export class UIManager {
    private gui: GUI;
    private config: any;
    private hyperMesh: HyperMesh;
    private sceneManager: SceneManager;
    private raycaster: THREE.Raycaster;
    private mouse: THREE.Vector2;
    private tooltip: HTMLElement;
    private lastMouseEvent: MouseEvent | null = null;
    private modelName = models.hyper_objects.map(m => m.name);

    constructor(hyperMesh: HyperMesh, sceneManager: SceneManager) {
        this.hyperMesh = hyperMesh;
        this.sceneManager = sceneManager;
        this.gui = new GUI({ title: '4D 控制面板' });
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.tooltip = document.getElementById('tooltip')!;
        
        // 初始配置
        this.config = {
            model: this.modelName[0],
            autoRotate: true,
            // XW 平面
            angleXW: 0,
            speedXW: 0.01,
            enableXW: true,
            // YW 平面
            angleYW: 0,
            speedYW: 0.005,
            enableYW: true,
            // ZW 平面
            angleZW: 0,
            speedZW: 0,
            enableZW: false,

            projectionDist: 2.0,
            pointSize: 0.1,
            lineOpacity: 1,
            rotation3DX: 0,
            rotation3DY: 0,
            rotation3DZ: 0
        };

        this.init();
        this.setupEventListeners();
    }

    private init() {
        // 模型选择
        this.gui.add(this.config, 'model', this.modelName).name('当前物体').onChange((name: string) => {
            const modelData = models.hyper_objects.find(m => m.name === name);
            if (modelData) {
                this.hyperMesh.setModel(modelData);
            } else {
                console.warn(`模型 ${name} 未找到！`);
            }
        });

        // 4D 空间旋转控制
        const rotationFolder = this.gui.addFolder('4D 空间旋转');
        rotationFolder.add(this.config, 'autoRotate').name('开启自动旋转');

        const xwFolder = rotationFolder.addFolder('XW 平面 (X轴关联)');
        xwFolder.add(this.config, 'enableXW').name('启用');
        xwFolder.add(this.config, 'angleXW', 0, Math.PI * 2).name('角度 (rad)').listen().onChange((v: number) => {
            this.hyperMesh.rotationXW = v;
        });
        xwFolder.add(this.config, 'speedXW', 0, 0.05).name('旋转速度');

        const ywFolder = rotationFolder.addFolder('YW 平面 (Y轴关联)');
        ywFolder.add(this.config, 'enableYW').name('启用');
        ywFolder.add(this.config, 'angleYW', 0, Math.PI * 2).name('角度 (rad)').listen().onChange((v: number) => {
            this.hyperMesh.rotationYW = v;
        });
        ywFolder.add(this.config, 'speedYW', 0, 0.05).name('旋转速度');

        const zwFolder = rotationFolder.addFolder('ZW 平面 (Z轴关联)');
        zwFolder.add(this.config, 'enableZW').name('启用');
        zwFolder.add(this.config, 'angleZW', 0, Math.PI * 2).name('角度 (rad)').listen().onChange((v: number) => {
            this.hyperMesh.rotationZW = v;
        });
        zwFolder.add(this.config, 'speedZW', 0, 0.05).name('旋转速度');

        // 3D 空间变换
        const transformFolder = this.gui.addFolder('3D 空间变换');
        transformFolder.add(this.config, 'rotation3DX', -Math.PI, Math.PI).name('3D 旋转 X').onChange((v: number) => {
            this.hyperMesh.rotation3D.x = v;
        });
        transformFolder.add(this.config, 'rotation3DY', -Math.PI, Math.PI).name('3D 旋转 Y').onChange((v: number) => {
            this.hyperMesh.rotation3D.y = v;
        });
        transformFolder.add(this.config, 'rotation3DZ', -Math.PI, Math.PI).name('3D 旋转 Z').onChange((v: number) => {
            this.hyperMesh.rotation3D.z = v;
        });

        // 投影设置
        const projectionFolder = this.gui.addFolder('投影设置');
        projectionFolder.add(this.config, 'projectionDist', 1.1, 5.0).name('W 轴偏置').onChange((val: number) => {
            this.hyperMesh.projectionDistance = val;
        });

        // 视觉效果
        const visualFolder = this.gui.addFolder('视觉效果');
        visualFolder.add(this.config, 'pointSize', 0.01, 0.5).name('点大小').onChange((val: number) => {
            const points = this.hyperMesh.getObject().children.find(c => c instanceof THREE.Points) as THREE.Points;
            if (points && points.material instanceof THREE.PointsMaterial) {
                points.material.size = val;
            }
        });
        visualFolder.add(this.config, 'lineOpacity', 0.1, 1.0).name('线透明度').onChange((val: number) => {
            const lines = this.hyperMesh.getObject().children.find(c => c instanceof THREE.LineSegments) as THREE.LineSegments;
            if (lines && lines.material instanceof THREE.LineBasicMaterial) {
                lines.material.opacity = val;
            }
        });
    }

    private setupEventListeners() {
        window.addEventListener('mousemove', (event) => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            this.lastMouseEvent = event;
        });
    }

    // 顶点信息显示
    private updateTooltip() {
        if (!this.lastMouseEvent) return;
        const event = this.lastMouseEvent;
        
        this.raycaster.setFromCamera(this.mouse, this.sceneManager.getCamera());
        // 设置拾取精度
        this.raycaster.params.Points!.threshold = 0.15;

        const points = this.hyperMesh.getObject().children.find(c => c instanceof THREE.Points) as THREE.Points;
        if (!points) return;

        const intersects = this.raycaster.intersectObject(points);

        if (intersects.length > 0) {
            const index = intersects[0].index!;
            const info = this.hyperMesh.getVertexInfo(index);
            
            if (info) {
                this.tooltip.style.display = 'block';
                this.tooltip.style.left = `${event.clientX + 15}px`;
                this.tooltip.style.top = `${event.clientY + 15}px`;
                this.tooltip.innerHTML = `
                    <div style="color: #00ffcc; font-weight: bold; margin-bottom: 5px; border-bottom: 1px solid #00ffcc;">顶点索引: #${index}</div>
                    <div style="font-size: 11px; line-height: 1.4;">
                        <b style="color: #ffcc00;">[4D 原始位置]</b><br/>
                        X: ${info.v4.x.toFixed(3)} | Y: ${info.v4.y.toFixed(3)}<br/>
                        Z: ${info.v4.z.toFixed(3)} | W: ${info.v4.w.toFixed(3)}<br/>
                        <div style="margin: 4px 0; border-top: 1px dashed #555;"></div>
                        <b style="color: #ffcc00;">[3D 投影位置]</b><br/>
                        x: ${info.v3.x.toFixed(3)} | y: ${info.v3.y.toFixed(3)} | z: ${info.v3.z.toFixed(3)}
                    </div>
                `;
            }
        } else {
            this.tooltip.style.display = 'none';
        }
    }

    /**
     * 更新每一帧需要显示的实时变量
     */
    public update() {
        // 角度归一化处理（0-2PI），方便 UI 显示
        const twoPI = Math.PI * 2;
        if (this.config.angleXW > twoPI) this.config.angleXW -= twoPI;
        if (this.config.angleYW > twoPI) this.config.angleYW -= twoPI;
        if (this.config.angleZW > twoPI) this.config.angleZW -= twoPI;
        if (this.config.angleXW < 0) this.config.angleXW += twoPI;
        if (this.config.angleYW < 0) this.config.angleYW += twoPI;
        if (this.config.angleZW < 0) this.config.angleZW += twoPI;

        this.updateTooltip();
    }

    public getConfig() {
        return this.config;
    }
}
