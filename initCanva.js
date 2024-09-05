// Get the canvas element for WebGL rendering
var canvas = document.getElementById("myCanvas");

// Get another canvas element for 2D drawing, such as text or UI elements
var text = document.getElementById("text");

// Get the WebGL rendering context for 3D rendering on the canvas
var gl = canvas.getContext("webgl");

// Get the 2D rendering context for textCanvas to draw text and other 2D graphics
const textCanvas = document.getElementById("text");
const ctx = textCanvas.getContext("2d");

// Get the WebGL extension 'WEBGL_depth_texture' for depth texture support
// 深度纹理是用于进行深度测试和阴影映射的
var ext = gl.getExtension('WEBGL_depth_texture');

// Check if the browser supports the 'WEBGL_depth_texture' extension
if (!ext) {
    // If the extension is not supported, alert the user
    alert("ERRORE! WEBGL_depth_texture is not support");
}
