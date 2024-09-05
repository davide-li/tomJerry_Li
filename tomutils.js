// Convert degrees to radians
function degToRad(d) {
	return d * Math.PI / 180;
}

// Convert radians to degrees
function radToDeg(r) {
	return r * 180 / Math.PI;
}

// Check if a value is a power of 2
function isPowerOf2(value) {
	return (value & (value - 1)) == 0;
}

// Load all faces of a cubemap texture from a single image (Skybox)
function loadSkyboxTexture(jpg_resource) {
	const texture = gl.createTexture(); // Create a texture object
	gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture); // Bind the texture as a cubemap

	const faceInfos = [
		{ target: gl.TEXTURE_CUBE_MAP_POSITIVE_X, url: jpg_resource, },
		{ target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X, url: jpg_resource, },
		{ target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y, url: jpg_resource, },
		{ target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, url: jpg_resource, },
		{ target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z, url: jpg_resource, },
		{ target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, url: jpg_resource, },
	];

	const image = new Image();
	image.src = faceInfos[0].url; // Set the image source
	image.addEventListener('load', function () {
		// Once the image loads, apply it to each face of the cubemap
		faceInfos.forEach((faceInfo) => {
			const { target } = faceInfo;
			const level = 0;
			const internalFormat = gl.RGBA;
			const width = 1024;
			const height = 1024;
			const format = gl.RGBA;
			const type = gl.UNSIGNED_BYTE;
			gl.texImage2D(target, level, internalFormat, width, height, 0, format, type, null); // Create an empty cubemap texture
			gl.texImage2D(target, level, internalFormat, format, type, image); // Fill the face with the image
		});
		gl.generateMipmap(gl.TEXTURE_CUBE_MAP); // Generate Mipmap
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR); // Set filtering for mipmap
	});

	return texture; // Return the generated cubemap texture
}

// Load 2D texture from an image
function loadTextureFromImg(imageSrc) {
	var texture = gl.createTexture(); // Create a 2D texture object

	var textureImage = new Image();
	textureImage.src = imageSrc; // Set the image source
	textureImage.addEventListener('load', function () {
		gl.bindTexture(gl.TEXTURE_2D, texture); // Bind the texture object
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureImage); // Load the image data into the texture

		// Check if the image dimensions are powers of 2
		if (isPowerOf2(textureImage.width) && isPowerOf2(textureImage.height)) {
			gl.generateMipmap(gl.TEXTURE_2D); // Generate Mipmap
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST); // Set mipmap filtering
		} else {
			// Set texture parameters in case image dimensions are not powers of 2
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		}
	});

	return texture; // Return the generated 2D texture
}

// Create depth texture and framebuffer for shadow mapping
function createTextureLight() {
	depthTexture = gl.createTexture(); // Create depth texture
	depthTextureSize = 1024;
	gl.bindTexture(gl.TEXTURE_2D, depthTexture); // Bind the texture object
	gl.texImage2D(
		gl.TEXTURE_2D,
		0,
		gl.DEPTH_COMPONENT,
		depthTextureSize,
		depthTextureSize,
		0,
		gl.DEPTH_COMPONENT,
		gl.UNSIGNED_INT,
		null); // Create an empty depth texture

	// Set filtering parameters for the depth texture
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

	depthFramebuffer = gl.createFramebuffer(); // Create framebuffer object
	gl.bindFramebuffer(gl.FRAMEBUFFER, depthFramebuffer); // Bind the framebuffer
	gl.framebufferTexture2D(
		gl.FRAMEBUFFER,
		gl.DEPTH_ATTACHMENT,
		gl.TEXTURE_2D,
		depthTexture,
		0); // Attach the depth texture to the framebuffer

	// Create an unused color texture and attach to the framebuffer
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

// OBJ file parsing

// Store WebGL vertex data
var webglVertexData = [
	[],   // Positions
	[],   // Texture coordinates
	[],   // Normals
];

// Get a specific object from the array of objects to draw by name
function getObjToDraw(objsToDraw, name){
	return objsToDraw.find(x => x.name === name);
}

// Load OBJ file from URL
function loadObj(url) {
	let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4) {
			parseOBJ(xhttp.responseText); // Parse OBJ data when file is loaded
		}
	};
	xhttp.open("GET", url, false);
	xhttp.send(null);
}

// Parse OBJ file content and convert it to WebGL vertex data
function parseOBJ(text) {
	webglVertexData = [
		[],   // Positions
		[],   // Texture coordinates
		[],   // Normals
	];

	const objPositions = [[0, 0, 0]];
	const objTexcoords = [[0, 0]];
	const objNormals = [[0, 0, 0]];

	const objVertexData = [
		objPositions,
		objTexcoords,
		objNormals,
	];

	// Add vertex information
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
			objPositions.push(parts.map(parseFloat)); // Process vertex positions
		},
		vn(parts) {
			objNormals.push(parts.map(parseFloat)); // Process normals
		},
		vt(parts) {
			objTexcoords.push(parts.map(parseFloat)); // Process texture coordinates
		},
		f(parts) {
			const numTriangles = parts.length - 2;
			for (let tri = 0; tri < numTriangles; ++tri) {
				addVertex(parts[0]); // Process the first vertex
				addVertex(parts[tri + 1]); // Process the second vertex
				addVertex(parts[tri + 2]); // Process the third vertex
			}
		},
	};

	const keywordRE = /(\w*)(?: )*(.*)/; // Regular expression to match keywords and arguments
	const lines = text.split('\n');
	for (let lineNo = 0; lineNo < lines.length; ++lineNo) {
		const line = lines[lineNo].trim();
		if (line === '' || line.startsWith('#')) {
			continue; // Skip empty lines or comment lines
		}
		const m = keywordRE.exec(line);
		if (!m) {
			continue;
		}
		const [, keyword, unparsedArgs] = m;
		const parts = line.split(/\s+/).slice(1); // Split arguments
		const handler = keywords[keyword]; // Get the handler function
		if (!handler) {
			continue;
		}

		handler(parts, unparsedArgs); // Call the handler function to process the current line
	}
}
