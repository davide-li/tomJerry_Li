/**
 * 这个代码的作用是将游戏的内容展示在画布上。
 * 遇到的问题有：
 * 1.更改了图片和按钮的位置，导致功能失效。
 *
 * @type {boolean}
 */

// Variabili: 变量的定义与初始化

var texture_enable = true; // 用于启用或禁用纹理的布尔变量

// 用于表示桶的状态，0表示未收集，1表示已收集
var barile1 = 0;
var barile2 = 0;
var barile3 = 0;

// 表示游戏状态的布尔变量，morte为死亡状态，vittoria为胜利状态
var morte = false;
var vittoria = false;

var numBarili = 0; // 收集的桶数量
var barile = false; // 目前未使用的变量

// 图像对象初始化，用于加载游戏相关的图片资源
var gameOver = new Image();
gameOver.src = "resources/images/gameover.png";
gameOver.addEventListener('load', function() {});

var campagna = new Image();
campagna.src = "resources/images/youwin.png";
campagna.addEventListener('load', function() {});

var wasd_keys = new Image();
wasd_keys.src = "resources/images/wasd.png";
wasd_keys.addEventListener('load', function() {});

var freccie = new Image();
freccie.src = "resources/images/freccie.png";
freccie.addEventListener('load', function() {});

var retry = new Image();
retry.src = "resources/images/start.png";
retry.addEventListener('load', function() {});

var restart = new Image();
restart.src = "resources/images/replay.png";
restart.addEventListener('load', function() {});

// -----------------------------------------------------------

// Set di funzioni per disegnare gli oggetti 3D nella scena
// 用于绘制3D场景中的对象的函数集

// 绘制牛的函数
function drawCow(ProgramInfo){
    let u_model4 = m4.scale(m4.translation(posX, posY, posZ), 0.1, 0.1, 0.1); // 设置牛的模型矩阵，包含平移和缩放变换
    u_model4 = m4.yRotate(u_model4, degToRad(facing)); // 根据朝向旋转
    u_model4 = m4.yRotate(u_model4, degToRad(90)); // 进一步旋转
    u_model4 = m4.xRotate(u_model4, degToRad(-90)); // 旋转模型
    u_model4 = m4.zRotate(u_model4, degToRad(90)); // 旋转模型
    webglUtils.setBuffersAndAttributes(gl, ProgramInfo, bufferInfo_cow); // 设置缓冲区和属性
    webglUtils.setUniforms(ProgramInfo, {
        u_world: u_model4,
        u_texture: texture_cow, // 使用牛的纹理
    });
    webglUtils.drawBufferInfo(gl, bufferInfo_cow); // 绘制牛
}

// 绘制敌人的函数
function drawEnemy(ProgramInfo, time, bufferInf, x_enemy, z_enemy){
    let u_model = m4.identity(); // 初始化模型矩阵
    u_model = m4.scale(m4.translation(x_enemy, 5.5, z_enemy), 5, 5, 5); // 设置敌人位置和缩放
    u_model = m4.yRotate(u_model, time); // 基于时间旋转敌人
    webglUtils.setBuffersAndAttributes(gl, ProgramInfo, bufferInf); // 设置缓冲区和属性
    webglUtils.setUniforms(ProgramInfo, {
        u_colorMult: [0.5, 0.5, 1, 1], // 颜色乘法因子
        u_world: u_model,
        u_texture: texture_sphere, // 使用球体纹理
    });
    webglUtils.drawBufferInfo(gl, bufferInf); // 绘制敌人

    // 更新敌人的位置，使其移动到玩家的位置
    if(clock == 0){
        if(x_enemy > posX){
            x_enemu--; // 如果敌人x坐标大于玩家，减小x坐标
        } else {
            x_enemu++; // 否则增加x坐标
        }
        if(z_enemy > posZ){
            z_enemu--; // 如果敌人z坐标大于玩家，减小z坐标
        } else {
            z_enemu++; // 否则增加z坐标
        }
        clock++;
    } else if(clock == 15) {
        clock = 0; // 计时器复位
    } else {
        clock++;
    }
}

// 绘制第一个桶的函数
function drawBarile(ProgramInfo, time){
    let u_modelfolder = m4.scale(m4.translation(bar1xz[0], 1, bar1xz[1]), 10, 10, 10); // 设置桶的位置和缩放
    u_modelfolder = m4.yRotate(u_modelfolder, time); // 旋转桶
    u_modelfolder = m4.yRotate(u_modelfolder, degToRad(180)); // 旋转桶
    webglUtils.setBuffersAndAttributes(gl, ProgramInfo, bufferInfo_folder); // 设置缓冲区和属性
    webglUtils.setUniforms(ProgramInfo, {
        u_colorMult: [0.5, 0.5, 1, 1], // 颜色乘法因子
        u_world: u_modelfolder,
        u_texture: texture_folder, // 使用桶的纹理
    });
    webglUtils.drawBufferInfo(gl, bufferInfo_folder); // 绘制桶
}

// 绘制第二个桶的函数
function drawBarile2(ProgramInfo, time){
    let u_modelfolder = m4.scale(m4.translation(bar2xz[0], 1, bar2xz[1]), 10, 10, 10); // 设置桶的位置和缩放
    u_modelfolder = m4.yRotate(u_modelfolder, time); // 旋转桶
    webglUtils.setBuffersAndAttributes(gl, ProgramInfo, bufferInfo_folder); // 设置缓冲区和属性
    webglUtils.setUniforms(ProgramInfo, {
        u_colorMult: [0.5, 0.5, 1, 1], // 颜色乘法因子
        u_world: u_modelfolder,
        u_texture: texture_folder, // 使用桶的纹理
    });
    webglUtils.drawBufferInfo(gl, bufferInfo_folder); // 绘制桶
}

// 绘制第三个桶的函数
function drawBarile3(ProgramInfo, time){
    let u_modelfolder = m4.scale(m4.translation(bar3xz[0], 1, bar3xz[1]), 10, 10, 10); // 设置桶的位置和缩放
    u_modelfolder = m4.yRotate(u_modelfolder, time); // 旋转桶
    webglUtils.setBuffersAndAttributes(gl, ProgramInfo, bufferInfo_folder); // 设置缓冲区和属性
    webglUtils.setUniforms(ProgramInfo, {
        //u_colorMult: [0.5, 0.5, 1, 1], // 该行被注释，意味着可能未使用颜色乘法
        u_world: u_modelfolder,
        u_texture: texture_folder, // 使用桶的纹理
    });
    webglUtils.drawBufferInfo(gl, bufferInfo_folder); // 绘制桶
}

// 绘制地面的函数
function drawFloor(ProgramInfo){
    let u_modelfloor = m4.identity(); // 使用单位矩阵，表示没有特殊的模型变换
    webglUtils.setBuffersAndAttributes(gl, ProgramInfo, bufferInfo_floor); // 设置缓冲区和属性
    webglUtils.setUniforms(ProgramInfo, {
        u_world: u_modelfloor,
        u_texture: texture_floor, // 使用地板的纹理
    });
    webglUtils.drawBufferInfo(gl, bufferInfo_floor); // 绘制地面
}

// 绘制天空盒的函数
function drawSkybox(gl, skyboxProgramInfo, view, projection) {
    gl.depthFunc(gl.LEQUAL); // 设置深度函数，使得天空盒绘制在最远的背景

    const viewMatrix = m4.copy(view); // 复制视图矩阵

    // 移除视图矩阵中的平移分量
    viewMatrix[12] = 0;
    viewMatrix[13] = 0;
    viewMatrix[14] = 0;

    let viewDirectionProjectionMatrix = m4.multiply(projection, viewMatrix); // 计算视图方向投影矩阵
    let viewDirectionProjectionInverse = m4.inverse(viewDirectionProjectionMatrix); // 计算视图方向投影矩阵的逆矩阵
    gl.useProgram(skyboxProgramInfo.program); // 使用天空盒着色程序
    webglUtils.setBuffersAndAttributes(gl, skyboxProgramInfo, bufferInfo_skybox); // 设置缓冲区和属性
    webglUtils.setUniforms(skyboxProgramInfo, {
        u_viewDirectionProjectionInverse: viewDirectionProjectionInverse,
        u_skybox: texture_skybox, // 使用天空盒的纹理
    });
    webglUtils.drawBufferInfo(gl, bufferInfo_skybox); // 绘制天空盒
}

// 绘制整个场景的函数
function drawScene(projectionMatrix, camera, textureMatrix, lightWorldMatrix, programInfo, time) {
    const viewMatrix = m4.inverse(camera); // 计算视图矩阵
    gl.useProgram(programInfo.program); // 使用普通着色程序
    if (texture_enable == true) {
        webglUtils.setUniforms(programInfo, {
            u_view: viewMatrix,
            u_projection: projectionMatrix,
            u_bias: bias,
            u_textureMatrix: textureMatrix,
            u_projectedTexture: depthTexture,
            u_reverseLightDirection: lightWorldMatrix.slice(8, 11),
            u_lightDirection: m4.normalize([-1, 3, 5]),
            u_lightIntensity: lightIntensity,
            u_shadowIntensity: shadowIntensity,
        });
    }
    if (texture_enable == false) {
        textureMatrix = m4.identity();
        textureMatrix = m4.scale(textureMatrix, 0, 0, 0);
        webglUtils.setUniforms(programInfo, {
            u_view: viewMatrix,
            u_projection: projectionMatrix,
            u_bias: bias,
            u_textureMatrix: textureMatrix,
            u_reverseLightDirection: lightWorldMatrix.slice(8, 11),
            u_lightDirection: m4.normalize([-1, 3, 5]),
            u_lightIntensity: lightIntensity,
            u_shadowIntensity: shadowIntensity,
        });
    }

    drawCow(programInfo); // 绘制牛
    drawEnemy(programInfo, time, bufferInfo_sphere, x_enemu, z_enemu); // 绘制敌人

    // 根据桶的状态绘制桶
    if (barile1 == 0) {
        drawBarile(programInfo, time);
    }
    if (barile2 == 0) {
        drawBarile2(programInfo, time);
    }
    if (barile3 == 0) {
        drawBarile3(programInfo, time);
    }

    // 检查玩家是否收集了所有桶
    if (numBarili == 3) {
        vittoria = 1; // 设置胜利状态
    }
    drawFloor(programInfo); // 绘制地面
}

// -----------------------------------------------------------

// Funzione per il render di testo, menu e bottoni
// 用于渲染文本、菜单和按钮的函数

function drawMiscElements() {
    // 检查设备类型，如果是移动设备，显示对应的控制提示图像
    if( (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) ) {
        // 如果是移动设备，显示 WASD 和方向键的提示图像
        ctx.drawImage(wasd_keys, 80, 330); // 在画布上的位置 (80, 330) 绘制 WASD 控制提示图像
        ctx.drawImage(freccie, 540, 330); // 在画布上的位置 (540, 330) 绘制方向键控制提示图像
    } else {
        // 如果不是移动设备，目前不执行任何操作
    }

    // 在画布上绘制白色文本：提示玩家收集被偷走的牛奶桶
    ctx.font = '18pt Arial'; // 设置字体为 18pt 的 Arial
    ctx.fillStyle = 'white'; // 设置文本颜色为白色
    ctx.fillText("You need to catch all Jerry", 20, 30); // 在位置 (20, 30) 绘制文本

    // 绘制黑色文本：与上面白色文本稍有偏移，以产生阴影效果
    ctx.font = '18pt Arial'; // 设置字体为 18pt 的 Arial
    ctx.fillStyle = 'black'; // 设置文本颜色为黑色
    ctx.fillText("You need to catch all Jerry", 22, 32); // 在位置 (22, 32) 绘制文本

    // 在画布上绘制白色文本：提示玩家逃离坏蛋农场主
    ctx.font = '18pt Calibri'; // 设置字体为 18pt 的 Calibri
    ctx.fillStyle = 'white'; // 设置文本颜色为白色
    ctx.fillText("Escape from BOSS behind you!", 842, 32); // 在位置 (842, 32) 绘制文本

    // 根据已收集的桶的数量，显示相应的提示文本
    ctx.font = '14pt Arial'; // 设置字体为 14pt 的 Arial
    ctx.fillStyle = 'white'; // 设置文本颜色为白色
    numBarili = barile1 + barile2 + barile3; // 计算已收集的桶的数量
    if ((numBarili) == 0) {
        ctx.fillText("There are 3 Jerry", 842, 52); // 如果没有收集到桶，显示“缺少 3 个桶”
    } else if ((numBarili) == 1) {
        ctx.fillText("There are 2 Jerry", 842, 52); // 如果收集到 1 个桶，显示“加油，还剩 2 个”
    } else if ((numBarili) == 2) {
        ctx.fillText("There is only 1 Jerry", 842, 52); // 如果收集到 2 个桶，显示“只剩 1 个了”
    }

    // 重复上面的步骤，用红色绘制相同的文本，以产生强调效果
    ctx.font = '18pt Calibri'; // 设置字体为 18pt 的 Calibri
    ctx.fillStyle = 'red'; // 设置文本颜色为红色
    ctx.fillText("Escape from BOSS behind you!", 840, 30); // 在位置 (840, 30) 绘制文本

    // 根据已收集的桶的数量，显示相应的红色提示文本
    ctx.font = '14pt Arial'; // 设置字体为 14pt 的 Arial
    ctx.fillStyle = 'red'; // 设置文本颜色为红色
    numBarili = barile1 + barile2 + barile3; // 重新计算已收集的桶的数量
    if ((numBarili) == 0) {
        ctx.fillText("There are 3 Jerry", 840, 50); // 如果没有收集到桶，显示“缺少 3 个桶”
    } else if ((numBarili) == 1) {
        ctx.fillText("There are 2 Jerry", 840, 50); // 如果收集到 1 个桶，显示“加油，还剩 2 个”
    } else if ((numBarili) == 2) {
        ctx.fillText("There is only 1 Jerry", 840, 50); // 如果收集到 2 个桶，显示“只剩 1 个了”
    }

    // 检查游戏状态，如果玩家已经死亡，显示“游戏结束”图像和重试按钮
    if (morte == 1) {
        ctx.drawImage(gameOver, 0, 0, text.clientWidth, text.clientHeight); // 在画布上显示游戏结束图像，占满整个画布
        ctx.drawImage(retry, 480, 175); // 在位置 (480, 175) 绘制重试按钮图像
    }

    // 如果玩家胜利，显示胜利场景图像和重新开始按钮，并显示胜利信息
    if (vittoria == 1) {
        ctx.drawImage(campagna, 0, 0, text.clientWidth, text.clientHeight); // 在画布上显示胜利场景图像，占满整个画布
        ctx.drawImage(restart, 480, 175); // 在位置 (480, 175) 绘制重新开始按钮图像
        ctx.font = '40pt Playfair Display'; // 设置字体为 40pt 的 Arial
        ctx.fillStyle = 'yellow'; // 设置文本颜色为白色
        ctx.fillText("YOU WIN!", 450, 150); // 在位置 (290, 30) 绘制胜利文本
    }
}
