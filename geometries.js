/**代码功能概述
 对象和纹理的初始化：使用多个函数来加载几何体和纹理。每个几何体都有对应的缓冲信息变量和纹理变量。

 加载对象几何体：通过调用诸如loadObj之类的函数从文件中读取对象数据，并将这些数据分配给相应的缓冲信息变量。

 加载纹理：通过调用loadTextureFromImg函数从图像文件加载纹理，并将这些纹理分配给相应的纹理变量。

 地板的创建：loadFloor()函数创建一个简单的平面来表示地板，并指定其位置、法线和纹理坐标。

 天空盒的创建：loadSkyBox()函数定义了一个天空盒，通过加载一个包含六个面的纹理（通常用于模拟天空的背景）。

 这个代码片段显示了如何使用WebGL来加载和渲染不同的三维对象，使用不同的缓冲信息来存储几何体数据，并为这些对象应用纹理。
 **/

// 用于存储不同对象的缓冲信息
let bufferInfo_sphere;   // 球体对象的缓冲信息
let bufferInfo_skybox;   // 天空盒对象的缓冲信息
let bufferInfo_floor;    // 地板对象的缓冲信息
let bufferInfo_cow;      // 牛模型对象的缓冲信息
let bufferInfo_folder;   // 文件夹模型对象的缓冲信息

// 用于存储不同对象的纹理
let texture_sphere;      // 球体对象的纹理
let texture_skybox;      // 天空盒对象的纹理
let texture_cow;         // 牛模型对象的纹理
let texture_floor;       // 地板对象的纹理
let texture_folder;      // 文件夹模型对象的纹理

// 初始化函数，用于加载所有几何体
function setGeo(gl) {
    loadSphere();   // 加载球体几何体
    loadMouse();    // 加载Jerry小老鼠
    loadCat();      // 加载猫模型
    loadFloor();    // 加载地板
    loadSkyBox();   // 加载天空盒
}


// 加载天空盒的几何体和纹理
function loadSkyBox() {
    var jpg_resource  = 'resources/images/skybox.jpg'
    texture_skybox = loadSkyboxTexture(jpg_resource);  // 加载天空盒的纹理
    // 创建天空盒的缓冲信息，定义其几何体为一个简单的长方形
    bufferInfo_skybox = webglUtils.createBufferInfoFromArrays(gl, {
        position: {
            data: new Float32Array([
                -1, -1, // 左下角三角形
                1, -1,
                -1,  1,
                -1,  1, // 右上角三角形
                1, -1,
                1,  1,
            ]),
            numComponents: 2,
        },
    });
}

// 加载地板的几何体和纹理
function loadFloor() {
    const S = 80;          // 地板的大小
    const H = 0;           // 地板的高度
    const textureCoords = [0, 0, 1, 0, 0, 1, 1, 1];  // 纹理坐标

    // 定义地板的几何体数据，包括位置、纹理坐标、索引和法线
    const arrays_floor = {
        position: { numComponents: 3, data: [-S, H, -S, S, H, -S, -S, H, S, S, H, S], },
        texcoord: { numComponents: 2, data: textureCoords, },
        indices: { numComponents: 3, data: [0, 2, 1, 2, 3, 1], },
        normal: { numComponents: 3, data: [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0], },
    };

    // 创建缓冲信息并将地板的几何体数据加载到缓冲区中
    bufferInfo_floor = webglUtils.createBufferInfoFromArrays(gl, arrays_floor);

    // 加载地板的纹理
    texture_floor = loadTextureFromImg("resources/images/grass.png");
}

// 加载球体的几何体和纹理
function loadSphere() {
    loadObj("resources/obj/sphere.obj");  // 加载球体的OBJ模型

    const scaleFactor = 0.8; // 缩小2倍
    for (let i = 0; i < webglVertexData[0].length; i++) {
        webglVertexData[0][i] *= scaleFactor;
    }

    const sphere_array = {
        position: { numComponents: 3, data: webglVertexData[0], },  // 位置数据
        texcoord: { numComponents: 2, data: webglVertexData[1], },  // 纹理坐标数据
        normal: { numComponents: 3, data: webglVertexData[2], },    // 法线数据
    };

    // 创建缓冲信息并将球体的几何体数据加载到缓冲区中
    bufferInfo_sphere = webglUtils.createBufferInfoFromArrays(gl, sphere_array);

    // 加载球体的纹理
    texture_sphere = loadTextureFromImg("resources/obj/me.png");
}

function loadMouse() {
    loadObj("resources/obj/Jerry.obj");  // 加载文件夹的OBJ模型

    // 调整模型的缩放比例
    const scaleFactor = 0.05; // 缩小20倍
    for (let i = 0; i < webglVertexData[0].length; i++) {
        webglVertexData[0][i] *= scaleFactor;
    }

    const folder_array = {
        position: { numComponents: 3, data: webglVertexData[0], },  // 位置数据
        texcoord: { numComponents: 2, data: webglVertexData[1], },  // 纹理坐标数据
        normal: { numComponents: 3, data: webglVertexData[2], },    // 法线数据
    };

    // 创建缓冲信息并将文件夹的几何体数据加载到缓冲区中
    bufferInfo_folder = webglUtils.createBufferInfoFromArrays(gl, folder_array);

    // 加载文件夹的纹理
    texture_folder = loadTextureFromImg("resources/obj/jerry.png");
}

// 加载猫模型的几何体和纹理
function loadCat() {
    loadObj("resources/obj/Cat.obj");  // 加载牛模型的OBJ文件

    const cat_infos = {
        position: { numComponents: 3, data: webglVertexData[0], },  // 位置数据
        texcoord: { numComponents: 2, data: webglVertexData[1], },  // 纹理坐标数据
        normal: { numComponents: 3, data: webglVertexData[2], },    // 法线数据
    };

    // 创建缓冲信息并将牛模型的几何体数据加载到缓冲区中
    bufferInfo_cow = webglUtils.createBufferInfoFromArrays(gl, cat_infos);

    // 加载牛模型的纹理
    texture_cow = loadTextureFromImg("resources/obj/cat.png");
}
