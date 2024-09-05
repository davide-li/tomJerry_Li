// Variables: 变量的定义与初始化

let texture_enable = true; // Boolean variable to enable or disable texture

// Jerry's status, 0 means not collected, 1 means collected
let jerry1 = 0;
let jerry2 = 0;
let jerry3 = 0;

// Boolean variables to represent game state: morte (death) and vittoria (victory)
let morte = false;
let vittoria = false;

let numJerrys = 0; // Number of collected Jerrys

// Initialize image objects for loading game-related images
let gameOver = new Image();
gameOver.src = "resources/images/gameover.png";
gameOver.addEventListener('load', function() {});

let campagna = new Image();
campagna.src = "resources/images/youwin.png";
campagna.addEventListener('load', function() {});

let wasd_keys = new Image();
wasd_keys.src = "resources/images/wasd.png";
wasd_keys.addEventListener('load', function() {});

let arrows = new Image();
arrows.src = "resources/images/arrows.png";
arrows.addEventListener('load', function() {});

let retry = new Image();
retry.src = "resources/images/start.png";
retry.addEventListener('load', function() {});

let restart = new Image();
restart.src = "resources/images/replay.png";
restart.addEventListener('load', function() {});

// Functions to draw 3D objects in the scene
// 绘制Tom的函数 Function to draw Tom
function drawTom(ProgramInfo){
    let u_model4 = m4.scale(m4.translation(posX, posY, posZ), 0.1, 0.1, 0.1); // Set Tom's model matrix with translation and scale
    u_model4 = m4.yRotate(u_model4, degToRad(facing)); // Rotate based on the facing direction
    u_model4 = m4.yRotate(u_model4, degToRad(90)); // Rotate further
    u_model4 = m4.xRotate(u_model4, degToRad(-90)); // Rotate model
    u_model4 = m4.zRotate(u_model4, degToRad(90)); // Rotate model
    webglUtils.setBuffersAndAttributes(gl, ProgramInfo, bufferInfo_tom); // Set buffer and attributes
    webglUtils.setUniforms(ProgramInfo, {
        u_world: u_model4,
        u_texture: texture_tom, // Use Tom's texture
    });
    webglUtils.drawBufferInfo(gl, bufferInfo_tom); // Draw Tom
}

// 绘制BOSS的函数 Function to draw the BOSS
function drawBoss(ProgramInfo, time, bufferInf, x_enemy, z_enemy){
    let u_model = m4.identity(); // Initialize model matrix
    u_model = m4.scale(m4.translation(x_enemy, 5.5, z_enemy), 5, 5, 5); // Set enemy position and scale
    u_model = m4.yRotate(u_model, time); // Rotate enemy based on time
    webglUtils.setBuffersAndAttributes(gl, ProgramInfo, bufferInf); // Set buffer and attributes
    webglUtils.setUniforms(ProgramInfo, {
        u_colorMult: [0.5, 0.5, 1, 1], // Color multiplier
        u_world: u_model,
        u_texture: texture_sphere, // Use sphere texture for the enemy
    });
    webglUtils.drawBufferInfo(gl, bufferInf); // Draw enemy

    // Update enemy position to move toward the player
    if(clock == 0){
        if(x_enemy > posX){
            x_enemu--; // Decrease x if enemy's x is greater than player's x
        } else {
            x_enemu++; // Increase x otherwise
        }
        if(z_enemy > posZ){
            z_enemu--; // Decrease z if enemy's z is greater than player's z
        } else {
            z_enemu++; // Increase z otherwise
        }
        clock++;
    } else if(clock == 15) {
        clock = 0; // Reset clock
    } else {
        clock++;
    }
}

// 绘制第一个Jerry的函数 Function to draw the first Jerry
function drawJerry(ProgramInfo, time){
    let u_modeljerry = m4.scale(m4.translation(jerry1xz[0], 1, jerry1xz[1]), 10, 10, 10); // Set Jerry's position and scale
    u_modeljerry = m4.yRotate(u_modeljerry, time); // Rotate Jerry
    u_modeljerry = m4.yRotate(u_modeljerry, degToRad(180)); // Rotate Jerry further
    webglUtils.setBuffersAndAttributes(gl, ProgramInfo, bufferInfo_jerry); // Set buffer and attributes
    webglUtils.setUniforms(ProgramInfo, {
        u_colorMult: [0.5, 0.5, 1, 1], // Color multiplier
        u_world: u_modeljerry,
        u_texture: texture_jerry, // Use Jerry's texture
    });
    webglUtils.drawBufferInfo(gl, bufferInfo_jerry); // Draw Jerry
}

// 绘制第二个Jerry的函数 Function to draw the second Jerry
function drawjerry2(ProgramInfo, time){
    let u_modeljerry = m4.scale(m4.translation(jerry2xz[0], 1, jerry2xz[1]), 10, 10, 10); // Set Jerry's position and scale
    u_modeljerry = m4.yRotate(u_modeljerry, time); // Rotate Jerry
    webglUtils.setBuffersAndAttributes(gl, ProgramInfo, bufferInfo_jerry); // Set buffer and attributes
    webglUtils.setUniforms(ProgramInfo, {
        u_colorMult: [0.5, 0.5, 1, 1], // Color multiplier
        u_world: u_modeljerry,
        u_texture: texture_jerry, // Use Jerry's texture
    });
    webglUtils.drawBufferInfo(gl, bufferInfo_jerry); // Draw Jerry
}

// 绘制第三个Jerry的函数 Function to draw the third Jerry
function drawjerry3(ProgramInfo, time){
    let u_modeljerry = m4.scale(m4.translation(jerry3xz[0], 1, jerry3xz[1]), 10, 10, 10); // Set Jerry's position and scale
    u_modeljerry = m4.yRotate(u_modeljerry, time); // Rotate Jerry
    webglUtils.setBuffersAndAttributes(gl, ProgramInfo, bufferInfo_jerry); // Set buffer and attributes
    webglUtils.setUniforms(ProgramInfo, {
        u_world: u_modeljerry,
        u_texture: texture_jerry, // Use Jerry's texture
    });
    webglUtils.drawBufferInfo(gl, bufferInfo_jerry); // Draw Jerry
}

// 绘制地面的函数 Function to draw the ground
function drawFloor(ProgramInfo){
    let u_modelfloor = m4.identity(); // Use identity matrix (no special transformations)
    webglUtils.setBuffersAndAttributes(gl, ProgramInfo, bufferInfo_floor); // Set buffer and attributes
    webglUtils.setUniforms(ProgramInfo, {
        u_world: u_modelfloor,
        u_texture: texture_floor, // Use floor texture
    });
    webglUtils.drawBufferInfo(gl, bufferInfo_floor); // Draw the floor
}

// 绘制天空盒的函数 Function to draw the sky
function drawSkybox(gl, skyboxProgramInfo, view, projection) {
    gl.depthFunc(gl.LEQUAL); // Set depth function to draw skybox at the farthest background

    const viewMatrix = m4.copy(view); // Copy view matrix

    // Remove the translation component of the view matrix
    viewMatrix[12] = 0;
    viewMatrix[13] = 0;
    viewMatrix[14] = 0;

    let viewDirectionProjectionMatrix = m4.multiply(projection, viewMatrix); // Calculate view direction projection matrix
    let viewDirectionProjectionInverse = m4.inverse(viewDirectionProjectionMatrix); // Calculate inverse of view direction projection matrix
    gl.useProgram(skyboxProgramInfo.program); // Use skybox shader program
    webglUtils.setBuffersAndAttributes(gl, skyboxProgramInfo, bufferInfo_skybox); // Set buffer and attributes
    webglUtils.setUniforms(skyboxProgramInfo, {
        u_viewDirectionProjectionInverse: viewDirectionProjectionInverse,
        u_skybox: texture_skybox, // Use skybox texture
    });
    webglUtils.drawBufferInfo(gl, bufferInfo_skybox); // Draw skybox
}
// Function to draw the entire scene
function drawScene(projectionMatrix, camera, textureMatrix, lightWorldMatrix, programInfo, time) {
    const viewMatrix = m4.inverse(camera); // Calculate view matrix (camera perspective)
    gl.useProgram(programInfo.program); // Use main shader program
    // If texture is enabled, set the texture and lighting uniforms
    if (texture_enable == true) {
        webglUtils.setUniforms(programInfo, {
            u_view: viewMatrix,
            u_projection: projectionMatrix,
            u_bias: bias,
            u_textureMatrix: textureMatrix,
            u_projectedTexture: depthTexture,
            u_reverseLightDirection: lightWorldMatrix.slice(8, 11), // Light direction for shadows
            u_lightDirection: m4.normalize([-1, 3, 5]), // Normalize light direction
            u_lightIntensity: lightIntensity, // Light intensity
            u_shadowIntensity: shadowIntensity, // Shadow intensity
        });
    }

    // If texture is disabled, scale the texture matrix to 0 to disable it
    if (texture_enable == false) {
        textureMatrix = m4.identity();
        textureMatrix = m4.scale(textureMatrix, 0, 0, 0); // Scale texture to zero
        webglUtils.setUniforms(programInfo, {
            u_view: viewMatrix,
            u_projection: projectionMatrix,
            u_bias: bias,
            u_textureMatrix: textureMatrix,
            u_reverseLightDirection: lightWorldMatrix.slice(8, 11),
            u_lightDirection: m4.normalize([-1, 3, 5]),
            u_lightIntensity: lightIntensity,
            u_shadowIntensity: shadowIntensity,
        });
    }

    // Draw Tom character
    drawTom(programInfo);

    // Draw enemy character
    drawBoss(programInfo, time, bufferInfo_sphere, x_enemu, z_enemu);

    // Draw Jerry characters based on their collection status
    if (jerry1 == 0) {
        drawJerry(programInfo, time); // Draw first Jerry if not collected
    }
    if (jerry2 == 0) {
        drawjerry2(programInfo, time); // Draw second Jerry if not collected
    }
    if (jerry3 == 0) {
        drawjerry3(programInfo, time); // Draw third Jerry if not collected
    }

    // Check if all Jerry characters are collected
    if (numJerrys == 3) {
        vittoria = 1; // Set victory state if all Jerrys are collected
    }

    // Draw the floor
    drawFloor(programInfo);
}

// Function to render text, menus, and buttons
function drawMiscElements() {
    // Check if the device is mobile, and display appropriate control hints
    if( (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) ) {
        // If mobile device, show WASD and arrow key control hints
        ctx.drawImage(wasd_keys, 80, 330); // Draw WASD control hints at position (80, 330)
        ctx.drawImage(arrows, 540, 330); // Draw arrow control hints at position (540, 330)
    } else {
        // No action for non-mobile devices currently
    }

    // Draw white text: prompt the player to catch Jerry
    ctx.font = '18pt Arial'; // Set font to 18pt Arial
    ctx.fillStyle = 'white'; // Set text color to white
    ctx.fillText("You need to catch all Jerry", 20, 30); // Draw text at position (20, 30)

    // Draw black text slightly offset to create a shadow effect
    ctx.font = '18pt Arial';
    ctx.fillStyle = 'black'; // Set text color to black
    ctx.fillText("You need to catch all Jerry", 22, 32); // Draw text at position (22, 32)

    // Draw white text: prompt the player to escape from the boss
    ctx.font = '18pt Calibri';
    ctx.fillStyle = 'white';
    ctx.fillText("Escape from BOSS behind you!", 842, 32); // Draw text at position (842, 32)

    // Display the number of Jerrys remaining based on how many have been collected
    ctx.font = '14pt Arial';
    ctx.fillStyle = 'white';
    numJerrys = jerry1 + jerry2 + jerry3; // Calculate number of collected Jerrys
    if (numJerrys == 0) {
        ctx.fillText("There are 3 Jerry", 842, 52); // If no Jerrys collected, display "There are 3 Jerry"
    } else if (numJerrys == 1) {
        ctx.fillText("There are 2 Jerry", 842, 52); // If 1 Jerry collected, display "There are 2 Jerry"
    } else if (numJerrys == 2) {
        ctx.fillText("There is only 1 Jerry", 842, 52); // If 2 Jerrys collected, display "There is only 1 Jerry"
    }

    // Repeat the above steps, but draw the text in red for emphasis
    ctx.font = '18pt Calibri';
    ctx.fillStyle = 'red';
    ctx.fillText("Escape from BOSS behind you!", 840, 30); // Draw red text at position (840, 30)

    // Display the number of remaining Jerrys in red text
    ctx.font = '14pt Arial';
    ctx.fillStyle = 'red';
    numJerrys = jerry1 + jerry2 + jerry3; // Recalculate collected Jerrys
    if (numJerrys == 0) {
        ctx.fillText("There are 3 Jerry", 840, 50); // Display "There are 3 Jerry" in red
    } else if (numJerrys == 1) {
        ctx.fillText("There are 2 Jerry", 840, 50); // Display "There are 2 Jerry" in red
    } else if (numJerrys == 2) {
        ctx.fillText("There is only 1 Jerry", 840, 50); // Display "There is only 1 Jerry" in red
    }

    // If the player has lost, show the game over image and retry button
    if (morte == 1) {
        ctx.drawImage(gameOver, 0, 0, text.clientWidth, text.clientHeight); // Display game over image full screen
        ctx.drawImage(retry, 480, 175); // Draw retry button at position (480, 175)
    }

    // If the player has won, show the victory image and restart button, with a victory message
    if (vittoria == 1) {
        ctx.drawImage(campagna, 0, 0, text.clientWidth, text.clientHeight); // Display victory image full screen
        ctx.drawImage(restart, 480, 175); // Draw restart button at position (480, 175)
        ctx.font = '40pt Playfair Display';
        ctx.fillStyle = 'yellow';
        ctx.fillText("YOU WIN!", 450, 150); // Display "YOU WIN!" message at position (450, 150)
    }
}
