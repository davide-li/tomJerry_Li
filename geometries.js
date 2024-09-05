// Buffer info for different objects
let bufferInfo_sphere;   // Buffer info for the sphere object
let bufferInfo_skybox;   // Buffer info for the skybox object
let bufferInfo_floor;    // Buffer info for the floor object
let bufferInfo_tom;      // Buffer info for the Tom model object
let bufferInfo_jerry;    // Buffer info for the Jerry model object

// Textures for different objects
let texture_sphere;      // Texture for the sphere object
let texture_skybox;      // Texture for the skybox object
let texture_tom;         // Texture for the Tom model object
let texture_floor;       // Texture for the floor object
let texture_jerry;       // Texture for the Jerry model object

// Initialization function to load all geometries
function setGeo() {
    loadSphere();   // Load sphere geometry
    loadMouse();    // Load Jerry the mouse
    loadTom();      // Load Tom the cat model
    loadFloor();    // Load floor
    loadSkyBox();   // Load skybox
}

// Load the skybox geometry and texture
function loadSkyBox() {
    var jpg_resource = 'resources/images/skybox.jpg';
    texture_skybox = loadSkyboxTexture(jpg_resource);  // Load skybox texture
    // Create skybox buffer info with a simple rectangle geometry
    bufferInfo_skybox = webglUtils.createBufferInfoFromArrays(gl, {
        position: {
            data: new Float32Array([
                -1, -1, // Bottom-left triangle
                1, -1,
                -1,  1,
                -1,  1, // Top-right triangle
                1, -1,
                1,  1,
            ]),
            numComponents: 2,
        },
    });
}

// Load the floor geometry and texture
function loadFloor() {
    const S = 80;          // Size of the floor
    const H = 0;           // Height of the floor
    const textureCoords = [0, 0, 1, 0, 0, 1, 1, 1];  // Texture coordinates

    // Define floor geometry including positions, texture coordinates, indices, and normals
    const arrays_floor = {
        position: { numComponents: 3, data: [-S, H, -S, S, H, -S, -S, H, S, S, H, S], },
        texcoord: { numComponents: 2, data: textureCoords, },
        indices: { numComponents: 3, data: [0, 2, 1, 2, 3, 1], },
        normal: { numComponents: 3, data: [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0], },
    };

    // Create buffer info and load floor geometry data into the buffer
    bufferInfo_floor = webglUtils.createBufferInfoFromArrays(gl, arrays_floor);

    // Load the floor texture
    texture_floor = loadTextureFromImg("resources/images/grass.png");
}

// Load the sphere geometry and texture
function loadSphere() {
    loadObj("resources/obj/sphere.obj");  // Load the sphere OBJ model

    const scaleFactor = 0.8; // Scale down by a factor of 0.8
    for (let i = 0; i < webglVertexData[0].length; i++) {
        webglVertexData[0][i] *= scaleFactor;
    }

    const sphere_array = {
        position: { numComponents: 3, data: webglVertexData[0], },  // Position data
        texcoord: { numComponents: 2, data: webglVertexData[1], },  // Texture coordinate data
        normal: { numComponents: 3, data: webglVertexData[2], },    // Normal data
    };

    // Create buffer info and load sphere geometry data into the buffer
    bufferInfo_sphere = webglUtils.createBufferInfoFromArrays(gl, sphere_array);

    // Load the sphere texture
    texture_sphere = loadTextureFromImg("resources/obj/me.png");
}

// Load the Jerry model geometry and texture
function loadMouse() {
    loadObj("resources/obj/Jerry.obj");  // Load Jerry OBJ model

    // Adjust the scale of the model
    const scaleFactor = 0.05; // Scale down by a factor of 0.05
    for (let i = 0; i < webglVertexData[0].length; i++) {
        webglVertexData[0][i] *= scaleFactor;
    }

    const jerry_array = {
        position: { numComponents: 3, data: webglVertexData[0], },  // Position data
        texcoord: { numComponents: 2, data: webglVertexData[1], },  // Texture coordinate data
        normal: { numComponents: 3, data: webglVertexData[2], },    // Normal data
    };

    // Create buffer info and load Jerry geometry data into the buffer
    bufferInfo_jerry = webglUtils.createBufferInfoFromArrays(gl, jerry_array);

    // Load Jerry texture
    texture_jerry = loadTextureFromImg("resources/obj/jerry.png");
}

// Load the Tom model geometry and texture
function loadTom() {
    loadObj("resources/obj/Cat.obj");  // Load Tom OBJ model

    const cat_infos = {
        position: { numComponents: 3, data: webglVertexData[0], },  // Position data
        texcoord: { numComponents: 2, data: webglVertexData[1], },  // Texture coordinate data
        normal: { numComponents: 3, data: webglVertexData[2], },    // Normal data
    };

    // Create buffer info and load Tom model geometry data into the buffer
    bufferInfo_tom = webglUtils.createBufferInfoFromArrays(gl, cat_infos);

    // Load Tom texture
    texture_tom = loadTextureFromImg("resources/obj/cat.png");
}
