// 摄像机和场景设置
var camera_posteriore = true; // 是否使用后视摄像机
var cambiaCamera = false; // 切换摄像机视角的标志
var cameraIso = false; // 是否使用固定的等距摄像机

// 摄像机的目标位置和当前位置
let cameraTarget = [0, 0, 0]; // 摄像机看向的目标位置
let cameraPosition = [0, 0, 0]; // 摄像机的当前位置
let up = [0, 1, 0]; // 向上的方向向量，决定摄像机的上方向

// 透视投影参数
const fieldOfViewRadians = degToRad(60); // 摄像机的视野角度（以弧度表示）
const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight; // 视锥体的宽高比

// 摄像机位置和控制相关的变量
var D = 17; // 摄像机与目标之间的距离
var cameraLiberabis = false; // 标志摄像机是否处于自由模式
var cameraLibera = false; // 鼠标拖拽标志
var drag; // 鼠标拖拽的相关变量
var bias = -0.00005; // 用于偏移深度值的偏差量（用于阴影计算）
var THETA = degToRad(86); // 自由摄像机的水平角度
var PHI = degToRad(23); // 自由摄像机的垂直角度

// 光源位置和相关参数
var x_light = 10,
    y_light = 200,
    z_light = 250,
    x_targetlight = 0,
    y_targetlight = 0,
    z_targetlight = 0,
    width_projLight = 3000,
    height_projLight = 1500,
    fovLight = 18, // 光源的视野角度
    lightIntensity = 2.5, // 光源强度
    shadowIntensity = 0.9; // 阴影强度

var clock = 0; // 用于时间跟踪的变量

// 用于存储矩阵的变量
var lightWorldMatrix; // 光源的世界矩阵
var lightProjectionMatrix; // 光源的投影矩阵

// 初始敌人位置
var x_enemu = xz[0];
var z_enemu = xz[1];

// 更新光源位置的函数
function updateLightx(event, ui) {
    x_light = ui.value; // 更新光源的x轴位置
}
function updateLighty(event, ui) {
    y_light = ui.value; // 更新光源的y轴位置
}
function updateLightz(event, ui) {
    z_light = ui.value; // 更新光源的z轴位置
}

// 其他控制变量
var doneSomething = false; // 用于检测是否有更新需要渲染
var nstep = 0; // 用于控制物理更新的步长
var timeNow = 0; // 当前时间

const PHYS_SAMPLING_STEP = 20; // 物理采样步长

// 用于天空盒、太阳、颜色的WebGL程序信息
var skyboxProgramInfo = webglUtils.createProgramInfo(gl, [skyVertShader, skyFragShader]);
var sunProgramInfo = webglUtils.createProgramInfo(gl, [sunVertShader, sunFragShader]);
var colorProgramInfo = webglUtils.createProgramInfo(gl, [colorVertShader, colorFragShader]);

// 设置几何图形和初始状态
setGeo(gl); // 设置场景中的几何物体
tomInit(); // 初始化游戏中的其他物体，如敌人
createTextureLight(); // 初始化用于阴影映射的纹理光源

// 初始化光源位置的滑块控制
webglLessonsUI.setupSlider("#LightX", {value: 10, slide: updateLightx, min: 0, max: 450, step: 1});
webglLessonsUI.setupSlider("#LightY", {value: 200, slide: updateLighty, min: 100, max: 450, step: 1});
webglLessonsUI.setupSlider("#LightZ", {value: 250, slide: updateLightz, min: 100, max: 350, step: 1});

// 更新函数，用于处理物理更新和渲染
function update(time) {
    if (nstep * PHYS_SAMPLING_STEP <= timeNow) { // 如果物理采样步长不足，跳过此帧
        tomMove(); // 更新敌人或物体的位置
        nstep++;
        doneSomething = true;
        window.requestAnimationFrame(update); // 请求下一帧的更新
        return; // 由于没有其他更新需求，返回
    }
    timeNow = time; // 更新当前时间
    if (doneSomething) {
        render(time); // 如果有更新，调用渲染函数
        doneSomething = false;
    }
    window.requestAnimationFrame(update); // 请求下一帧的更新
}

// 渲染函数，负责绘制场景
function render(time) {
    time *= 0.001; // 将时间转换为秒
    gl.enable(gl.DEPTH_TEST); // 启用深度测试，以便正确绘制重叠的物体

    // 首先从光源的视角绘制场景，用于阴影计算
    lightWorldMatrix = m4.lookAt(
        [x_light, y_light, z_light],          // 光源的位置
        [x_targetlight, y_targetlight, z_targetlight], // 光源的目标
        up                                     // 光源的上方向
    );

    lightProjectionMatrix = m4.perspective(
        degToRad(fovLight), // 光源的视野角度
        width_projLight / height_projLight, // 光源投影的宽高比
        8,  // 光源视锥体的近裁剪面
        700 // 光源视锥体的远裁剪面
    );

    // 绑定帧缓冲区，用于深度纹理的渲染
    gl.bindFramebuffer(gl.FRAMEBUFFER, depthFramebuffer);
    gl.viewport(0, 0, depthTextureSize, depthTextureSize); // 设置视口大小
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // 清除颜色和深度缓冲区

    // 绘制场景以生成深度纹理
    drawScene(lightProjectionMatrix, lightWorldMatrix, m4.identity(), lightWorldMatrix, colorProgramInfo, time);

    // 解除帧缓冲区绑定，恢复正常渲染
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height); // 设置回正常的视口
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // 清除2D Canvas
    gl.clearColor(0, 0, 0, 1); // 将背景颜色设置为黑色
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // 清除颜色和深度缓冲区

    // 设置纹理矩阵，用于阴影计算
    let textureMatrix = m4.identity();
    textureMatrix = m4.translate(textureMatrix, 0.5, 0.5, 0.5);
    textureMatrix = m4.scale(textureMatrix, 0.5, 0.5, 0.5);
    textureMatrix = m4.multiply(textureMatrix, lightProjectionMatrix);
    textureMatrix = m4.multiply(textureMatrix, m4.inverse(lightWorldMatrix));

    // 创建摄像机的投影矩阵
    var projection = m4.perspective(fieldOfViewRadians, aspect, 0.1, 1200);

    // 使用摄像机的位置和目标生成摄像机矩阵
    var camera = m4.lookAt(cameraPosition, cameraTarget, up);

    // 生成视图矩阵（摄像机矩阵的逆矩阵）
    var view = m4.inverse(camera);

    // 摄像机视角设置
    // 后视摄像机
    if (camera_posteriore) {
        cameraPosition = [posX + (D * Math.sin(degToRad(facing))), posY + 12, posZ + (D * Math.cos(degToRad(facing)))]
    }
    // 自由摄像机
    if (cameraLiberabis) {
        cameraPosition = [D * 1.5 * Math.sin(PHI) * Math.cos(THETA), D * 1.5 * Math.sin(PHI) * Math.sin(THETA), D * 1.5 * Math.cos(PHI)];
    }
    // 前视摄像机
    if (cambiaCamera && !cameraLiberabis) {
        cameraPosition = [posX + (-D * Math.sin(degToRad(facing))), posY + 10, posZ + (-D * Math.cos(degToRad(facing)))];
    }
    // 固定的等距视角
    if (cameraIso) {
        cameraPosition = [-90, 180, 90];
    }

    // 设置摄像机的目标位置
    if (!cameraIso) {
        cameraTarget = [posX, posY, posZ];
    } else {
        cameraTarget = [0, 0, 0];
    }

    // 绘制主场景
    drawScene(projection, camera, textureMatrix, lightWorldMatrix, sunProgramInfo, time);

    // 绘制天空盒
    drawSkybox(gl, skyboxProgramInfo, view, projection);

    // 绘制其他元素（如UI等）
    drawMiscElements();
}

// 开始动画更新
update();
window.requestAnimationFrame(update);
