// 将度数转换为弧度
function degToRad(d) {
	return d * Math.PI / 180;
}

// 将弧度转换为度数
function radToDeg(r) {
	return r * 180 / Math.PI;
}

// 检查一个值是否为2的幂
function isPowerOf2(value) {
	return (value & (value - 1)) == 0;
}

// 使用单张图片加载所有立方体贴图的面（Skybox）
function loadSkyboxTexture(jpg_resource) {
	const texture = gl.createTexture(); // 创建一个纹理对象
	gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture); // 绑定纹理类型为立方体贴图

	const faceInfos = [
		{ target: gl.TEXTURE_CUBE_MAP_POSITIVE_X, url: jpg_resource, },
		{ target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X, url: jpg_resource, },
		{ target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y, url: jpg_resource, },
		{ target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, url: jpg_resource, },
		{ target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z, url: jpg_resource, },
		{ target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, url: jpg_resource, },
	];

	const image = new Image();
	image.src = faceInfos[0].url; // 设置图片源路径
	image.addEventListener('load', function () {
		// 图片加载完成后，应用到立方体的各个面
		faceInfos.forEach((faceInfo) => {
			const { target } = faceInfo;
			const level = 0;
			const internalFormat = gl.RGBA;
			const width = 1024;
			const height = 1024;
			const format = gl.RGBA;
			const type = gl.UNSIGNED_BYTE;
			gl.texImage2D(target, level, internalFormat, width, height, 0, format, type, null); // 创建一个空的立方体贴图
			gl.texImage2D(target, level, internalFormat, format, type, image); // 用图片填充贴图面
		});
		gl.generateMipmap(gl.TEXTURE_CUBE_MAP); // 生成Mipmap
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR); // 设置Mipmap过滤方式
	});

	return texture; // 返回生成的立方体贴图纹理
}


// 从图像加载2D纹理
function loadTextureFromImg(imageSrc) {
	var texture = gl.createTexture(); // 创建一个2D纹理对象

	var textureImage = new Image();
	textureImage.src = imageSrc; // 设置图像源路径
	textureImage.addEventListener('load', function () {
		gl.bindTexture(gl.TEXTURE_2D, texture); // 绑定纹理对象
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureImage); // 将图像数据加载到纹理中

		// 检查图像是否为2的幂次方尺寸
		if (isPowerOf2(textureImage.width) && isPowerOf2(textureImage.height)) {
			gl.generateMipmap(gl.TEXTURE_2D); // 生成Mipmap
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST); // 设置Mipmap过滤
		} else {
			// 设置纹理参数以防止图像尺寸不是2的幂次方
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		}
	});

	return texture; // 返回生成的2D纹理
}

// 创建深度纹理和帧缓冲区
function createTextureLight() {
	depthTexture = gl.createTexture(); // 创建深度纹理
	depthTextureSize = 1024;
	gl.bindTexture(gl.TEXTURE_2D, depthTexture); // 绑定纹理对象
	gl.texImage2D(
		gl.TEXTURE_2D,
		0,
		gl.DEPTH_COMPONENT,
		depthTextureSize,
		depthTextureSize,
		0,
		gl.DEPTH_COMPONENT,
		gl.UNSIGNED_INT,
		null); // 创建空的深度纹理

	// 设置深度纹理的过滤参数
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

	depthFramebuffer = gl.createFramebuffer(); // 创建帧缓冲区对象
	gl.bindFramebuffer(gl.FRAMEBUFFER, depthFramebuffer); // 绑定帧缓冲区
	gl.framebufferTexture2D(
		gl.FRAMEBUFFER,
		gl.DEPTH_ATTACHMENT,
		gl.TEXTURE_2D,
		depthTexture,
		0); // 将深度纹理附加到帧缓冲区

	// 创建未使用的颜色纹理并附加到帧缓冲区
	unusedTexture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, unusedTexture);
	gl.texImage2D(
		gl.TEXTURE_2D,
		0,
		gl.RGBA,
		depthTextureSize,
		depthTextureSize,
		0,
		gl.RGBA,
		gl.UNSIGNED_BYTE,
		null,
	);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.framebufferTexture2D(
		gl.FRAMEBUFFER,
		gl.COLOR_ATTACHMENT0,
		gl.TEXTURE_2D,
		unusedTexture,
		0);
}

// OBJ 文件解析相关

// 存储WebGL顶点数据
var webglVertexData = [
	[],   // 位置
	[],   // 纹理坐标
	[],   // 法线
];

// 根据名称从要绘制的对象数组中获取指定的对象
function getObjToDraw(objsToDraw, name){
	return objsToDraw.find(x => x.name === name);
}

// 从URL加载OBJ文件
function loadObj(url) {
	let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4) {
			parseOBJ(xhttp.responseText); // 当文件加载完成时，解析OBJ数据
		}
	};
	xhttp.open("GET", url, false);
	xhttp.send(null);
}

// 解析OBJ文件内容，将其转换为WebGL可用的顶点数据
function parseOBJ(text) {
	webglVertexData = [
		[],   // positions
		[],   // texcoords
		[],   // normals
	];

	const objPositions = [[0, 0, 0]];
	const objTexcoords = [[0, 0]];
	const objNormals = [[0, 0, 0]];

	const objVertexData = [
		objPositions,
		objTexcoords,
		objNormals,
	];

	// 添加顶点信息
	function addVertex(vert) {
		const ptn = vert.split('/');
		ptn.forEach((objIndexStr, i) => {
			if (!objIndexStr) {
				return;
			}
			const objIndex = parseInt(objIndexStr);
			const index = objIndex + (objIndex >= 0 ? 0 : objVertexData[i].length);
			webglVertexData[i].push(...objVertexData[i][index]);
		});
	}

	const keywords = {
		v(parts) {
			objPositions.push(parts.map(parseFloat)); // 处理顶点位置
		},
		vn(parts) {
			objNormals.push(parts.map(parseFloat)); // 处理法线
		},
		vt(parts) {
			objTexcoords.push(parts.map(parseFloat)); // 处理纹理坐标
		},
		f(parts) {
			const numTriangles = parts.length - 2;
			for (let tri = 0; tri < numTriangles; ++tri) {
				addVertex(parts[0]); // 处理第一个顶点
				addVertex(parts[tri + 1]); // 处理第二个顶点
				addVertex(parts[tri + 2]); // 处理第三个顶点
			}
		},
	};

	const keywordRE = /(\w*)(?: )*(.*)/; // 正则表达式，用于匹配关键字和参数
	const lines = text.split('\n');
	for (let lineNo = 0; lineNo < lines.length; ++lineNo) {
		const line = lines[lineNo].trim();
		if (line === '' || line.startsWith('#')) {
			continue; // 跳过空行或注释行
		}
		const m = keywordRE.exec(line);
		if (!m) {
			continue;
		}
		const [, keyword, unparsedArgs] = m;
		const parts = line.split(/\s+/).slice(1); // 拆分参数
		const handler = keywords[keyword]; // 获取处理函数
		if (!handler) {
			continue;
		}

		handler(parts, unparsedArgs); // 调用处理函数处理当前行的参数
	}

}
