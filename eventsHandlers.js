// 为不同的用户交互事件添加事件监听器

window.addEventListener("keydown", doKeyDown, true); // 当键盘按下时触发 doKeyDown 函数
window.addEventListener("keyup", doKeyUp, true);     // 当键盘松开时触发 doKeyUp 函数
window.addEventListener("touchstart", doTouchDown, true); // 当触摸屏被按下时触发 doTouchDown 函数
window.addEventListener("touchend", doTouchUp, true);     // 当触摸屏被松开时触发 doTouchUp 函数

// 如果设备不是移动设备，则为鼠标事件添加监听器
if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
  text.addEventListener("mousedown", mouseDown);   // 当鼠标按下时触发 mouseDown 函数
  text.addEventListener("mouseup", mouseUp);       // 当鼠标松开时触发 mouseUp 函数
  text.addEventListener("mousemove", mouseMove);   // 当鼠标移动时触发 mouseMove 函数
  text.addEventListener("mouseout", mouseUp);      // 当鼠标移出元素时触发 mouseUp 函数
  window.addEventListener("wheel", zoom, { passive: false }); // 当鼠标滚轮移动时触发 zoom 函数
}

// 初始化指针坐标
var pointerX = -1;
var pointerY = -1;

// 当鼠标移动时，更新 pointerX 和 pointerY 的值
document.onmousemove = function (event) {
  pointerX = event.pageX;
  pointerY = event.pageY;
};

// 定期调用 pointerCheck 函数，每秒一次
setInterval(pointerCheck, 1000);
function pointerCheck() {
  // 该函数当前未实现
}

// 鼠标滚轮缩放功能
function zoom(event) {
  event.preventDefault(); // 阻止默认滚动行为
  D += event.deltaY * +0.01; // 根据滚轮移动的方向调整缩放比例
}

// 鼠标按下事件处理函数，开启拖拽模式
function mouseDown(e) {
  drag = true; // 设置拖拽标志
  cameraLiberabis = true; // 启用自由相机模式
  (old_x = e.pageX), (old_y = e.pageY); // 记录鼠标按下时的坐标
  e.preventDefault(); // 阻止默认行为
  return false;
}

// 鼠标松开事件处理函数，关闭拖拽模式
function mouseUp() {
  drag = false;
}

// 鼠标移动事件处理函数，用于相机控制
function mouseMove(e) {
  if (!drag) return false; // 如果未在拖拽模式下，不执行任何操作

  // 计算鼠标移动距离的角度
  dX = (-(e.pageX - old_x) * 2 * Math.PI) / canvas.width;
  dY = (-(e.pageY - old_y) * 2 * Math.PI) / canvas.height;
  THETA += dX; // 更新相机水平角度
  PHI += dY;   // 更新相机垂直角度

  // 限制相机角度范围
  if (PHI < 0.22) {
    PHI = 0.22;
  }
  if (THETA > 3.05) {
    THETA = 3.05;
  }
  if (PHI > 3.05) {
    PHI = 3.05;
  }

  // 更新旧的鼠标坐标
  (old_x = e.pageX), (old_y = e.pageY);
  e.preventDefault(); // 阻止默认行为
}

// 用户键盘交互处理函数
function doKeyDown(e) {
  switch (e.key) {
    case "w": // 按下 "W" 键，加速前进
      key[0] = true;
      break;
    case "a": // 按下 "A" 键，向左转向
      key[1] = true;
      break;
    case "s": // 按下 "S" 键，减速后退
      key[2] = true;
      break;
    case "d": // 按下 "D" 键，向右转向
      key[3] = true;
      break;
    case "ArrowUp": // 按下向上箭头键，提升相机高度
      cameraPosition[1] += 0.14;
      camera_posteriore = false;
      cambiaCamera = false;
      cameraLiberabis = false;
      break;
    case "ArrowDown": // 按下向下箭头键，降低相机高度
      camera_posteriore = false;
      cameraPosition[1] -= 0.14;
      cambiaCamera = false;
      cameraLiberabis = false;
      break;
    case "ArrowLeft": // 按下向左箭头键，向左移动相机
      camera_posteriore = false;
      cameraPosition[0] -= 0.14;
      cambiaCamera = false;
      cameraLiberabis = false;
      break;
    case "ArrowRight": // 按下向右箭头键，向右移动相机
      camera_posteriore = false;
      cameraPosition[0] += 0.14;
      cambiaCamera = false;
      cameraLiberabis = false;
      break;
    default:
      return; // 其他按键不处理
  }
}

// 用户键盘松开事件处理函数
function doKeyUp(e) {
  switch (e.key) {
    case "w": // 松开 "W" 键，停止前进
      key[0] = false;
      break;
    case "a": // 松开 "A" 键，停止向左转向
      key[1] = false;
      break;
    case "s": // 松开 "S" 键，停止后退
      key[2] = false;
      break;
    case "d": // 松开 "D" 键，停止向右转向
      key[3] = false;
      break;
    case "ArrowUp": // 松开向上箭头键
      break;
    case "ArrowDown": // 松开向下箭头键
      break;
    case "ArrowLeft": // 松开向左箭头键
      break;
    case "ArrowRight": // 松开向右箭头键
      break;
    default:
      return; // 其他按键不处理
  }
}

// 处理移动设备上的触摸交互
function doTouchDown(e) {
  touch = e.touches[0]; // 获取第一个触摸点
  x = touch.pageX - canvas.offsetLeft; // 计算触摸点的 x 坐标
  y = touch.pageY - canvas.offsetTop;  // 计算触摸点的 y 坐标

  // 判断触摸区域以模拟虚拟按键
  if (x >= 190 && y >= 351 && x <= 250 && y <= 417) { // 模拟 "W" 键
    key[0] = true;
  }
  if (x >= 190 && y >= 439 && x <= 251 && y <= 500) { // 模拟 "S" 键
    key[2] = true;
  }
  if (x >= 106 && y >= 438 && x <= 167 && y <= 503) { // 模拟 "A" 键
    key[1] = true;
  }
  if (x >= 274 && y >= 440 && x <= 335 && y <= 504) { // 模拟 "D" 键
    key[3] = true;
  }

  // 控制相机视角
  if (x >= 640 && y >= 351 && x <= 700 && y <= 417) { // 上移相机
    cameraPosition[1] += 1;
    camera_posteriore = false;
    cambiaCamera = false;
    cameraLiberabis = false;
  }
  if (x >= 640 && y >= 439 && x <= 700 && y <= 500) { // 下移相机
    cameraPosition[1] -= 1;
    camera_posteriore = false;
    cambiaCamera = false;
    cameraLiberabis = false;
  }
  if (x >= 556 && y >= 438 && x <= 617 && y <= 503) { // 左移相机
    cameraPosition[0] -= 1;
    camera_posteriore = false;
    cambiaCamera = false;
    cameraLiberabis = false;
  }
  if (x >= 724 && y >= 440 && x <= 785 && y <= 504) { // 右移相机
    cameraPosition[0] += 1;
    camera_posteriore = false;
    cambiaCamera = false;
    cameraLiberabis = false;
  }
}

// 处理移动设备上的触摸结束事件
function doTouchUp() {
  x = touch.pageX - canvas.offsetLeft; // 计算触摸点的 x 坐标
  y = touch.pageY - canvas.offsetTop;  // 计算触摸点的 y 坐标

  // 根据触摸点判断松开的按键
  if (x >= 190 && y >= 351 && x <= 250 && y <= 417) key[0] = false; // 松开 "W" 键
  if (x >= 190 && y >= 439 && x <= 251 && y <= 500) key[2] = false; // 松开 "S" 键
  if (x >= 106 && y >= 438 && x <= 167 && y <= 503) key[1] = false; // 松开 "A" 键
  if (x >= 274 && y >= 440 && x <= 335 && y <= 504) key[3] = false; // 松开 "D" 键
}

// 点击事件监听器
window.addEventListener("click", checkButtonClick);

// 处理点击事件的函数
function checkButtonClick(e) {
  x = e.pageX - canvas.offsetLeft; // 计算点击点的 x 坐标
  y = e.pageY - canvas.offsetTop;  // 计算点击点的 y 坐标

  // 检查点击是否在重新开始按钮区域
  if (x >= 490 && x <= 650 && y >= 178 && y <= 236 && (morte == true || vittoria == true)) {
    tomInit(); // 重新初始化游戏
    refreshJerrys(); // 刷新Jerry对象
    x_enemu = genValue(); // 生成新的BOSS x 坐标
    z_enemu = genValue(); // 生成新的BOSS z 坐标
    morte = false; // 复位死亡状态
    vittoria = false; // 复位胜利状态
    cambiaCamera = false; // 复位相机切换标志
    cameraLiberabis = false; // 复位自由相机模式
    cameraIso = false; // 复位等距相机模式
    jerry1 = false; // 复位Jerry1状态
    jerry2 = false; // 复位Jerry2状态
    jerry3 = false; // 复位Jerry3状态

    // 设置相机灯光滑块
    webglLessonsUI.setupSlider("#LightX", { value: 270, slide: updateLightx, min: 0, max: 450, step: 1 });
    webglLessonsUI.setupSlider("#LightY", { value: 200, slide: updateLighty, min: 100, max: 450, step: 1 });
    webglLessonsUI.setupSlider("#LightZ", { value: 250, slide: updateLightz, min: 100, max: 350, step: 1 });

    // 初始化灯光坐标
    x_light = 10;
    y_light = 200;
    z_light = 250;

    // 重置相机相关标志
    cambiaCamera = false;
    cameraLiberabis = false;
    cameraIso = false;
    cameraLibera = false;
    camera_posteriore = true;
  }
}
