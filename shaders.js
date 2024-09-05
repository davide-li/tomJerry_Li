// Vertex shader for solid color objects
const colorVertShader = `
  attribute vec4 a_position;

  uniform mat4 u_projection;
  uniform mat4 u_view;
  uniform mat4 u_world;

  void main() {
    // Calculate the final position of the vertex on the screen
    gl_Position = u_projection * u_view * u_world * a_position;
  }`;

// Fragment shader for solid color objects
const colorFragShader = `
  precision mediump float;

  uniform vec4 u_color;
  void main() {
    // Set the fragment color to the passed-in u_color
    gl_FragColor = u_color;
  }`;

// Vertex shader for textured and lit objects
const vertShader = `
  attribute vec4 a_position;
  attribute vec2 a_texcoord;
  attribute vec3 a_normal;

  uniform mat4 u_projection;
  uniform mat4 u_view;
  uniform mat4 u_model;

  varying vec3 v_normal;
  varying vec2 v_texcoord;

  void main() {
    // Calculate the final position of the vertex
    gl_Position = u_projection * u_view * u_model * a_position;
    // Calculate and pass the normal vector
    v_normal = mat3(u_model) * a_normal;
    // Pass the texture coordinates to the fragment shader
    v_texcoord = a_texcoord;
  }`;

// Fragment shader for textured and lit objects
const fragShader = `
  precision mediump float;

  varying vec3 v_normal;
  varying vec2 v_texcoord;

  uniform vec4 u_diffuse;
  uniform vec3 u_lightDirection;
  
  uniform sampler2D u_texture;

  void main () {
    vec3 normal = normalize(v_normal); // Normalize the normal vector
    // Compute a simple lighting effect
    float fakeLight = dot(u_lightDirection, normal) * .5 + .5;
    // Use the texture color for the fragment
    gl_FragColor = texture2D(u_texture, v_texcoord);
  }`;

// Skybox Vertex Shader
const skyVertShader = `
  attribute vec4 a_position;
  
  varying vec4 v_position;
  
  void main() {
    // Directly pass vertex position to fragment shader
    v_position = a_position;  
    gl_Position = a_position;
    gl_Position.z = 1.0; // Ensure the vertices are rendered far away
  }`;

// Skybox Fragment Shader
const skyFragShader = `
  precision mediump float;

  uniform samplerCube u_skybox;
  uniform mat4 u_viewDirectionProjectionInverse;
  
  varying vec4 v_position;
  
  void main() {
    // Calculate texture coordinates
    vec4 t = u_viewDirectionProjectionInverse * v_position;
    // Use the cube texture to determine the fragment color
    gl_FragColor = textureCube(u_skybox, normalize(t.xyz / t.w));
  }`;

// Sun Vertex Shader
const sunVertShader = `
  attribute vec4 a_position;
  attribute vec2 a_texcoord;
  attribute vec3 a_normal;

  uniform mat4 u_projection;
  uniform mat4 u_view;
  uniform mat4 u_world;
  uniform mat4 u_textureMatrix;

  varying vec2 v_texcoord;
  varying vec4 v_projectedTexcoord;
  varying vec3 v_normal;
  
  void main() {
    vec4 worldPosition = u_world * a_position; // Transform vertex to world space
    gl_Position = u_projection * u_view * worldPosition; // Calculate final vertex position

    v_texcoord = a_texcoord; // Pass texture coordinates to fragment shader
    v_projectedTexcoord = u_textureMatrix * worldPosition; // Calculate projected texture coordinates
    v_normal = mat3(u_world) * a_normal; // Calculate and pass normal
  }`;

// Sun Fragment Shader
const sunFragShader = `
  precision mediump float;

  varying vec2 v_texcoord;
  varying vec4 v_projectedTexcoord;
  varying vec3 v_normal;

  uniform vec4 u_colorMult;
  uniform sampler2D u_texture;
  uniform sampler2D u_projectedTexture;
  uniform float u_bias;
  uniform float u_lightIntensity;
  uniform float u_shadowIntensity;
  uniform vec3 u_reverseLightDirection;

  void main() {
    vec3 normal = normalize(v_normal); // Normalize the normal
    float light = dot(normal, u_reverseLightDirection); // Calculate lighting

    vec3 projectedTexcoord = v_projectedTexcoord.xyz / v_projectedTexcoord.w; // Compute projected texture coordinates
    float currentDepth = projectedTexcoord.z + u_bias; // Add bias to depth for shadow comparison

    // Check if the projected coordinates are within range
    bool inRange =
        projectedTexcoord.x >= 0.0 &&
        projectedTexcoord.x <= 1.0 &&
        projectedTexcoord.y >= 0.0 &&
        projectedTexcoord.y <= 1.0;

    // Get depth from the shadow map (projected texture)
    float projectedDepth = texture2D(u_projectedTexture, projectedTexcoord.xy).r;
    // Determine whether the pixel is in shadow or lit
    float shadowLight = (inRange && projectedDepth <= currentDepth) ? u_shadowIntensity : u_lightIntensity;

    // Sample the texture color and multiply by the color multiplier
    vec4 texColor = texture2D(u_texture, v_texcoord) * u_colorMult;
    // Final fragment color, modulated by light and shadow
    gl_FragColor = vec4(texColor.rgb * light * shadowLight, texColor.a);
  }`;
