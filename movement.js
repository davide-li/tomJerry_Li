/**
 * 代码功能概述
 * 初始化牛的运动状态：cowInit()函数设置了牛的位置、速度、方向以及其他与运动相关的参数。这些参数包括摩擦力、抓地力、最大加速度和转向速度等。
 *
 * 牛的运动逻辑：cowMove()函数处理牛的运动，包括根据当前速度和转向更新牛的位置和方向。牛的运动受速度、摩擦力和转向控制的影响。
 *
 * 碰撞检测：cowMove()函数中的多个条件语句检查牛是否与敌人接触、是否收集到桶或者是否超出地图边界，并据此改变游戏状态。
 *
 * 这段代码总体上模拟了一个简单的移动系统，利用摩擦力、加速度和碰撞检测来控制一个牛对象的运动和交互行为。
 */
// 定义用于表示牛位置、方向和速度的变量
var posX, posY, posZ, // 牛的当前位置信息
    facing;           // 牛的当前朝向（以角度表示）
var sterzo;           // 方向盘角度
var vx, vy, vz;       // 牛在三个轴上的当前速度

// 这些变量通常保持不变，用于定义牛的运动特性
var velSterzo, velRitornoSterzo, accMax, attrito, // 控制牛的运动特性的参数
    raggioRuotaA, raggioRuotaP, grip,            // 牛的车轮半径和抓地力
    attritoX, attritoY, attritoZ;                // X、Y、Z轴上的摩擦力
var key; // 用于记录按键状态的数组

// 初始化牛的运动变量
function cowInit() {
    // 初始化牛的初始状态
    posX = posY = posZ = facing = 0; // 牛的位置和方向
    sterzo = 0;                      // 牛的转向状态
    vx = vy = vz = 0;                // 牛的初始速度
    key = [false, false, false, false]; // 按键状态：用于控制前进、后退、左转、右转

    // 初始化运动控制参数
    velSterzo = 3.2;         // 方向盘转向速度
    velRitornoSterzo = 0.84; // 方向盘回正速度，最大转向角度 = A * B / (1 - B)
    accMax = 0.005;          // 最大加速度

    // 摩擦力参数：速度的保持百分比
    attritoZ = 0.99;  // Z轴上的小摩擦力，表示前进方向上的阻力
    attritoX = 0.8;   // X轴上的大摩擦力，侧向摩擦力较大
    attritoY = 1.0;   // Y轴上无摩擦力

    grip = 0.35; // 牛的方向跟随转向的速度（抓地力）
}

// 这个函数独立于渲染，用于处理牛的运动逻辑

// cowMove() 函数参考了课堂上的 "car2" 示例
function cowMove() {
    var vxm, vym, vzm; // 在本地坐标系下的速度分量

    // 将速度从全局坐标系转换到牛的局部坐标系
    var cosf = Math.cos(facing * Math.PI / 180.0); // 计算朝向的余弦值
    var sinf = Math.sin(facing * Math.PI / 180.0); // 计算朝向的正弦值
    vxm = +cosf * vx - sinf * vz; // 计算局部坐标系下的 X 轴速度
    vym = vy;                     // Y 轴速度不变
    vzm = +sinf * vx + cosf * vz; // 计算局部坐标系下的 Z 轴速度

    // 处理转向
    if (key[1]) sterzo += velSterzo; // 如果按下右转键，增加转向角度
    if (key[3]) sterzo -= velSterzo; // 如果按下左转键，减小转向角度
    sterzo *= velRitornoSterzo;      // 自动回正方向盘

    if (key[0]) vzm -= accMax; // 如果按下前进键，加速前进
    if (key[2]) vzm += accMax; // 如果按下后退键，加速后退

    // 应用摩擦力
    vxm *= attritoX; // X 轴摩擦力
    vym *= attritoY; // Y 轴摩擦力
    vzm *= attritoZ; // Z 轴摩擦力

    // 牛的方向随速度和转向状态的变化而变化
    facing = facing - (vzm * grip) * sterzo;

    // 将速度转换回全局坐标系
    vx = +cosf * vxm + sinf * vzm;
    vy = vym;
    vz = -sinf * vxm + cosf * vzm;

    // 更新牛的位置
    posX += vx;
    posY += vy;
    posZ += vz;

    // 检测牛是否接触到敌人
    if (posX >= x_enemu - 6 && posX <= x_enemu + 6 && posZ >= z_enemu - 6 && posZ <= z_enemu + 6) {
        morte = 1; // 设置死亡状态
    }

    // 检测牛是否收集到第一个桶
    if (posX >= bar1xz[0] - 6 && posX <= bar1xz[0] + 6 && posZ >= bar1xz[1] - 6 && posZ <= bar1xz[1] + 6) {
        barile1 = true; // 设置第一个桶的状态为已收集
    }

    // 检测牛是否收集到第二个桶
    if (posX >= bar2xz[0] - 6 && posX <= bar2xz[0] + 6 && posZ >= bar2xz[1] - 6 && posZ <= bar2xz[1] + 6) {
        barile2 = true; // 设置第二个桶的状态为已收集
    }

    // 检测牛是否收集到第三个桶
    if (posX >= bar3xz[0] - 6 && posX <= bar3xz[0] + 6 && posZ >= bar3xz[1] - 6 && posZ <= bar3xz[1] + 6) {
        barile3 = true; // 设置第三个桶的状态为已收集
    }

    // 检测牛是否超出地图边界
    if (posX >= 67 || posX <= -67 || posZ >= 67 || posZ <= -67) {
        morte = true; // 设置死亡状态
    }
}
