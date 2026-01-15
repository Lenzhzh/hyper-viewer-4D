import { SceneManager } from './engine/SceneManager';
import * as models from './core/models/models';
import { HyperMesh } from './engine/HyperMesh';
import { UIManager } from './ui/UIManager';

/**
 * 应用程序入口
 */
function main() {
    const container = document.getElementById('app');
    
    if (!container) {
        console.error('未找到 #app 容器');
        return;
    }

    // 1. 初始化 3D 视口环境
    const sceneManager = new SceneManager(container);

    // 创建渲染对象
    /*
     * 模型的定义：
        * - 顶点 (vertices): 定义了超正方体在 4D 空间中的 16 个顶点坐标 (x, y, z, w)
        * - 边 (edges): 定义了连接这些顶点的 32 条边，描述了超正方体的结构
        * - 通过这些顶点和边的信息，HyperMesh 类能够在 4D 空间中表示和操作超正方体，并将其投影到 3D 空间进行渲染。
        * - 该模型允许用户在 4D 空间中旋转和查看超正方体的不同投影视图。
        * - 目前使用的模型是标准的超立方体，适用于 4D 图形学和可视化应用。
     * 替换此处的 Tesseract 模型即可加载不同的模型。
    */
    const hyperMesh = new HyperMesh(models.Tesseract);
    sceneManager.getScene().add(hyperMesh.getObject());

    // 3. 初始化 UI 控制面板
    const ui = new UIManager(hyperMesh, sceneManager);

    // 4. 动画循环
    function animate() {
        requestAnimationFrame(animate);
        
        const config = ui.getConfig();
        
        // 根据 UI 配置更新旋转 (4D 空间)
        if (config.autoRotate) {
            if (config.enableXW) config.angleXW += config.speedXW;
            if (config.enableYW) config.angleYW += config.speedYW;
            if (config.enableZW) config.angleZW += config.speedZW;
        }

        // 同步 4D 角度到渲染引擎
        hyperMesh.rotationXW = config.angleXW;
        hyperMesh.rotationYW = config.angleYW;
        hyperMesh.rotationZW = config.angleZW;
        
        // 执行 4D 投影更新
        hyperMesh.update();
        
        // 同步 UI 状态（如 Tooltip 和 属性实时刷新）
        ui.update();
    }

    animate();

    console.log('Hyper Viewer 4D 演示 Demo 已启动。');
}

// 启动应用
window.addEventListener('DOMContentLoaded', main);
