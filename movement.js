// 定义用于表示Tom位置、方向和速度的变量
var posX, posY, posZ, // Tom的当前位置信息
    facing;           // Tom的当前朝向（以角度表示）
var sterzo;           // 方向盘角度
var vx, vy, vz;       // Tom在三个轴上的当前速度

// 这些变量通常保持不变，用于定义Tom的运动特性
var velSterzo, velRitornoSterzo, accMax, attrito, // 控制Tom的运动特性的参数
    raggioRuotaA, raggioRuotaP, grip,            // Tom的车轮半径和抓地力
    attritoX, attritoY, attritoZ;                // X、Y、Z轴上的摩擦力
var key; // 用于记录按键状态的数组

// 初始化Tom的运动变量
function tomInit() {
    // 初始化Tom的初始状态
    posX = posY = posZ = facing = 0; // Tom的位置和方向
    sterzo = 0;                      // Tom的转向状态
    vx = vy = vz = 0;                // Tom的初始速度
    key = [false, false, false, false]; // 按键状态：用于控制前进、后退、左转、右转

    // 初始化运动控制参数
    velSterzo = 3.2;         // 方向盘转向速度
    velRitornoSterzo = 0.84; // 方向盘回正速度，最大转向角度 = A * B / (1 - B)
    accMax = 0.005;          // 最大加速度

    // 摩擦力参数：速度的保持百分比
    attritoZ = 0.99;  // Z轴上的小摩擦力，表示前进方向上的阻力
    attritoX = 0.8;   // X轴上的大摩擦力，侧向摩擦力较大
    attritoY = 1.0;   // Y轴上无摩擦力

    grip = 0.35; // Tom的方向跟随转向的速度（抓地力）
}

// 这个函数独立于渲染，用于处理Tom的运动逻辑
// tomMove() 函数参考了课堂上的 "car2" 示例
function tomMove() {
    var vxm, vym, vzm; // 在本地坐标系下的速度分量

    // 将速度从全局坐标系转换到Tom的局部坐标系
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

    // Tom的方向随速度和转向状态的变化而变化
    facing = facing - (vzm * grip) * sterzo;

    // 将速度转换回全局坐标系
    vx = +cosf * vxm + sinf * vzm;
    vy = vym;
    vz = -sinf * vxm + cosf * vzm;

    // 更新Tom的位置
    posX += vx;
    posY += vy;
    posZ += vz;

    // 检测Tom是否接触到敌人
    if (posX >= x_enemu - 6 && posX <= x_enemu + 6 && posZ >= z_enemu - 6 && posZ <= z_enemu + 6) {
        morte = 1; // 设置死亡状态
    }

    // 检测Tom是否收集到第一个Jerry
    if (posX >= jerry1xz[0] - 6 && posX <= jerry1xz[0] + 6 && posZ >= jerry1xz[1] - 6 && posZ <= jerry1xz[1] + 6) {
        jerry1 = true; // 设置第一个Jerry的状态为已收集
    }

    // 检测Tom是否收集到第二个Jerry
    if (posX >= jerry2xz[0] - 6 && posX <= jerry2xz[0] + 6 && posZ >= jerry2xz[1] - 6 && posZ <= jerry2xz[1] + 6) {
        jerry2 = true; // 设置第二个Jerry的状态为已收集
    }

    // 检测Tom是否收集到第三个Jerry
    if (posX >= jerry3xz[0] - 6 && posX <= jerry3xz[0] + 6 && posZ >= jerry3xz[1] - 6 && posZ <= jerry3xz[1] + 6) {
        jerry3 = true; // 设置第三个Jerry的状态为已收集
    }

    // 检测Tom是否超出地图边界
    if (posX >= 67 || posX <= -67 || posZ >= 67 || posZ <= -67) {
        morte = true; // 设置死亡状态
    }
}
