
// Camera and scene settings
var camera_posteriore = true; // Whether to use rear camera
var cambiaCamera = false; // Flag to switch camera view
var cameraIso = false; // Whether to use fixed isometric camera

// Camera target position and current position
let cameraTarget = [0, 0, 0]; // Target position the camera is looking at
let cameraPosition = [0, 0, 0]; // Current camera position
let up = [0, 1, 0]; // Up direction vector, determines the camera's upward direction

// Perspective projection parameters
const fieldOfViewRadians = degToRad(60); // Camera field of view in radians
const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight; // Aspect ratio of the camera's frustum

// Camera position and control-related variables
var D = 17; // Distance between the camera and the target
var cameraLiberabis = false; // Flag indicating if the camera is in free mode
var cameraLibera = false; // Mouse drag flag
var drag; // Variables related to mouse dragging
var bias = -0.00005; // Offset for depth value (used for shadow calculation)
var THETA = degToRad(86); // Free camera horizontal angle
var PHI = degToRad(23); // Free camera vertical angle

// Light source position and related parameters
var x_light = 10,
    y_light = 200,
    z_light = 250,
    x_targetlight = 0,
    y_targetlight = 0,
    z_targetlight = 0,
    width_projLight = 3000,
    height_projLight = 1500,
    fovLight = 18, // Light source field of view
    lightIntensity = 2.5, // Light source intensity
    shadowIntensity = 0.9; // Shadow intensity

var clock = 0; // Variable used to track time

// Variables for storing matrices
var lightWorldMatrix; // Light source world matrix
var lightProjectionMatrix; // Light source projection matrix

// Initial enemy position
var x_enemu = xz[0];
var z_enemu = xz[1];

// Function to update light source position
function updateLightx(event, ui) {
    x_light = ui.value; // Update x-axis position of the light source
}
function updateLighty(event, ui) {
    y_light = ui.value; // Update y-axis position of the light source
}
function updateLightz(event, ui) {
    z_light = ui.value; // Update z-axis position of the light source
}

// Other control variables
var doneSomething = false; // Detects if updates need to be rendered
var nstep = 0; // Controls physics update step
var timeNow = 0; // Current time

const PHYS_SAMPLING_STEP = 20; // Physics sampling step

// WebGL program info for skybox, sun, and color rendering
var skyboxProgramInfo = webglUtils.createProgramInfo(gl, [skyVertShader, skyFragShader]);
var sunProgramInfo = webglUtils.createProgramInfo(gl, [sunVertShader, sunFragShader]);
var colorProgramInfo = webglUtils.createProgramInfo(gl, [colorVertShader, colorFragShader]);

// Set geometries and initial states
setGeo(gl); // Set geometry in the scene
tomInit(); // Initialize other objects in the game, such as enemies
createTextureLight(); // Initialize texture for shadow mapping

// Initialize slider controls for light source position
webglLessonsUI.setupSlider("#LightX", {value: 10, slide: updateLightx, min: 0, max: 450, step: 1});
webglLessonsUI.setupSlider("#LightY", {value: 200, slide: updateLighty, min: 100, max: 450, step: 1});
webglLessonsUI.setupSlider("#LightZ", {value: 250, slide: updateLightz, min: 100, max: 350, step: 1});

// Update function for physics and rendering
function update(time) {
    if (nstep * PHYS_SAMPLING_STEP <= timeNow) { // If not enough physics sampling steps, skip this frame
        tomMove(); // Update enemy or object position
        nstep++;
        doneSomething = true;
        window.requestAnimationFrame(update); // Request next frame update
        return; // No further updates needed, return
    }
    timeNow = time; // Update current time
    if (doneSomething) {
        render(time); // If updates occurred, call render function
        doneSomething = false;
    }
    window.requestAnimationFrame(update); // Request next frame update
}

// Render function responsible for drawing the scene
function render(time) {
    time *= 0.001; // Convert time to seconds
    gl.enable(gl.DEPTH_TEST); // Enable depth testing for correct drawing of overlapping objects

    // First, draw the scene from the light's perspective for shadow mapping
    lightWorldMatrix = m4.lookAt(
        [x_light, y_light, z_light],          // Light source position
        [x_targetlight, y_targetlight, z_targetlight], // Light source target
        up                                     // Light source up direction
    );

    lightProjectionMatrix = m4.perspective(
        degToRad(fovLight), // Light source field of view
        width_projLight / height_projLight, // Light projection aspect ratio
        8,  // Near clipping plane of the light's frustum
        700 // Far clipping plane of the light's frustum
    );

    // Bind the framebuffer for rendering depth texture
    gl.bindFramebuffer(gl.FRAMEBUFFER, depthFramebuffer);
    gl.viewport(0, 0, depthTextureSize, depthTextureSize); // Set viewport size
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear color and depth buffers

    // Draw the scene to generate the depth texture
    drawScene(lightProjectionMatrix, lightWorldMatrix, m4.identity(), lightWorldMatrix, colorProgramInfo, time);

    // Unbind framebuffer and restore normal rendering
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height); // Restore normal viewport
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Clear 2D canvas
    gl.clearColor(0, 0, 0, 1); // Set background color to black
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear color and depth buffers

    // Set up texture matrix for shadow mapping
    let textureMatrix = m4.identity();
    textureMatrix = m4.translate(textureMatrix, 0.5, 0.5, 0.5);
    textureMatrix = m4.scale(textureMatrix, 0.5, 0.5, 0.5);
    textureMatrix = m4.multiply(textureMatrix, lightProjectionMatrix);
    textureMatrix = m4.multiply(textureMatrix, m4.inverse(lightWorldMatrix));

    // Create camera projection matrix
    var projection = m4.perspective(fieldOfViewRadians, aspect, 0.1, 1200);

    // Use camera position and target to generate camera matrix
    var camera = m4.lookAt(cameraPosition, cameraTarget, up);

    // Generate view matrix (inverse of the camera matrix)
    var view = m4.inverse(camera);

    // Camera view settings
    // Rear camera
    if (camera_posteriore) {
        cameraPosition = [posX + (D * Math.sin(degToRad(facing))), posY + 12, posZ + (D * Math.cos(degToRad(facing)))]
    }
    // Free camera
    if (cameraLiberabis) {
        cameraPosition = [D * 1.5 * Math.sin(PHI) * Math.cos(THETA), D * 1.5 * Math.sin(PHI) * Math.sin(THETA), D * 1.5 * Math.cos(PHI)];
    }
    // Front camera
    if (cambiaCamera && !cameraLiberabis) {
        cameraPosition = [posX + (-D * Math.sin(degToRad(facing))), posY + 10, posZ + (-D * Math.cos(degToRad(facing)))];
    }
    // Fixed isometric view
    if (cameraIso) {
        cameraPosition = [-90, 180, 90];
    }

    // Set camera target position
    if (!cameraIso) {
        cameraTarget = [posX, posY, posZ];
    } else {
        cameraTarget = [0, 0, 0];
    }

    // Draw the main scene
    drawScene(projection, camera, textureMatrix, lightWorldMatrix, sunProgramInfo, time);

    // Draw the skybox
    drawSkybox(gl, skyboxProgramInfo, view, projection);

    // Draw other elements (e.g., UI)
    drawMiscElements();
}

// Start animation updates
update();
window.requestAnimationFrame(update);
