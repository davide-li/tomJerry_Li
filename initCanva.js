// 获取 canvas 元素，用于 WebGL 渲染
var canvas = document.getElementById("myCanvas");

// 获取另一个 canvas 元素（通常用于 2D 绘图，例如显示文本或 UI 元素）
var text = document.getElementById("text");

// 获取 WebGL 渲染上下文，用于在 canvas 上进行 3D 渲染
var gl = canvas.getContext("webgl");

// 获取 2D 渲染上下文，用于在 text canvas 上绘制文本和其他 2D 图形
const textCanvas = document.getElementById("text");
const ctx = textCanvas.getContext("2d");

// 获取 WebGL 扩展 'WEBGL_depth_texture'，用于支持深度纹理
// 深度纹理是用于进行深度测试和阴影映射的
var ext = gl.getExtension('WEBGL_depth_texture');

// 检查浏览器是否支持 'WEBGL_depth_texture' 扩展
if (!ext) {
  // 如果不支持，显示一个警告框，提示用户 WebGL 深度纹理不被支持
  alert("ERRORE! WEBGL_depth_texture is not support");
}
