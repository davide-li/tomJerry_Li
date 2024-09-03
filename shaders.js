const colorVertShader = `
  attribute vec4 a_position;

  uniform mat4 u_projection;
  uniform mat4 u_view;
  uniform mat4 u_world;

  void main() {
    // 计算顶点在屏幕上的最终位置
    gl_Position = u_projection * u_view * u_world * a_position;
  }`;

const colorFragShader = `
  precision mediump float;

  uniform vec4 u_color;
  void main() {
    // 片元颜色设置为传入的 u_color
    gl_FragColor = u_color;
  }`;

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
    // 计算顶点在屏幕上的位置
    gl_Position = u_projection * u_view * u_model * a_position;
    // 计算并传递法线向量
    v_normal = mat3(u_model) * a_normal;
    // 传递纹理坐标到片元着色器
    v_texcoord = a_texcoord;
  }`;

const fragShader = `
  precision mediump float;

  varying vec3 v_normal;
  varying vec2 v_texcoord;

  uniform vec4 u_diffuse;
  uniform vec3 u_lightDirection;
  
  uniform sampler2D u_texture;

  void main () {
    vec3 normal = normalize(v_normal);
    // 计算简化的光照效果
    float fakeLight = dot(u_lightDirection, normal) * .5 + .5;
    // 使用纹理颜色渲染片元
    gl_FragColor = texture2D(u_texture, v_texcoord);
  }`;

//SKYBOX SHADERS
const skyVertShader = `
  attribute vec4 a_position;
  
  varying vec4 v_position;
  
  void main() {
    // 直接将顶点位置传递给片元着色器
    v_position = a_position;  
    gl_Position = a_position;
    gl_Position.z = 1.0; // 保证顶点在远处渲染
  }`;

const skyFragShader = `
  precision mediump float;

  uniform samplerCube u_skybox;
  uniform mat4 u_viewDirectionProjectionInverse;
  
  varying vec4 v_position;
  
  void main() {
    // 计算纹理坐标
    vec4 t = u_viewDirectionProjectionInverse * v_position;
    gl_FragColor = textureCube(u_skybox, normalize(t.xyz/t.w));
  }`;

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
    vec4 worldPosition = u_world * a_position;
    gl_Position = u_projection * u_view * worldPosition;

    v_texcoord = a_texcoord;
    v_projectedTexcoord = u_textureMatrix * worldPosition;
    v_normal = mat3(u_world) * a_normal;
  }`;

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
    vec3 normal = normalize(v_normal);
    float light = dot(normal, u_reverseLightDirection);

    vec3 projectedTexcoord = v_projectedTexcoord.xyz / v_projectedTexcoord.w;
    float currentDepth = projectedTexcoord.z + u_bias;

    bool inRange =
        projectedTexcoord.x >= 0.0 &&
        projectedTexcoord.x <= 1.0 &&
        projectedTexcoord.y >= 0.0 &&
        projectedTexcoord.y <= 1.0;

    float projectedDepth = texture2D(u_projectedTexture, projectedTexcoord.xy).r;
    float shadowLight = (inRange && projectedDepth <= currentDepth) ? u_shadowIntensity : u_lightIntensity;

    vec4 texColor = texture2D(u_texture, v_texcoord) * u_colorMult;
    gl_FragColor = vec4(texColor.rgb * light * shadowLight, texColor.a);
  }`;
		