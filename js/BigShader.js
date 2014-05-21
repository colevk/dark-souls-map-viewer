/**
 * Shader program that does edge detection and lambert shading, and accepts a
 * number of switches. Having everything together in one big shader with
 * switches is probably bad practice.
 */
BigShader = {
  attributes: {
    "vertexNumber": { type: 'f' }
  },

  uniforms: {
    "edgeColor":       { type: "c", value: new THREE.Color(0x000000) },
    "edgeHighlight":   { type: "f", value: 0.0 },
    "edgeAttenuation": { type: "f", value: 1.0 },
    "wrapAround":      { type: "f", value: 1.0 },
    "normalShading":   { type: "f", value: 0.0 }
  },

  vertexShader: [
    "attribute float vertexNumber;",

    "varying vec3 vNormal;",
    "varying vec3 vBC;",

    "void main() {",
      "vNormal = normal;",
      "vBC = vec3(0.0);",

      // Convert vertex number to barycentric coordinates
      "if (vertexNumber < 0.5) {",
        "vBC.x = 1.0;",
      "} else if (vertexNumber < 1.5) {",
        "vBC.y = 1.0;",
      "} else {",
        "vBC.z = 1.0;",
      "}",

      "gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);",
    "}"
  ].join("\n"),

  fragmentShader: [
    "#extension GL_OES_standard_derivatives : enable",

    "uniform vec3 edgeColor;",
    "uniform float edgeHighlight;",
    "uniform float edgeAttenuation;",
    "uniform float wrapAround;",
    "uniform float normalShading;",

    "uniform vec3 ambientLightColor;",

    "#if (MAX_DIR_LIGHTS > 0)",
      "uniform vec3 directionalLightDirection[MAX_DIR_LIGHTS];",
      "uniform vec3 directionalLightColor[MAX_DIR_LIGHTS];",
    "#endif",

    "varying vec3 vNormal;",
    "varying vec3 vBC;",

    // Calculates closeness to edge of triangle.
    "float edgeFactor() {",
        "vec3 d = fwidth(vBC);",
        "vec3 a3 = smoothstep(vec3(0.0), d, vBC);",
        "return min(min(a3.x, a3.y), a3.z);",
    "}",

    "void main() {",
        "vec3 normal;",

        "if (gl_FrontFacing) {",
          "normal = vNormal;",
        "} else {",
          "normal = -vNormal;",
        "}",

        // Ambient lighting
        "vec3 faceColor = ambientLightColor;",

        // Basic lambert shading for directional lights only
        "#if (MAX_DIR_LIGHTS > 0)",
          "for (int i = 0; i < MAX_DIR_LIGHTS; i++) {",
            "float intensity = dot(normalize(normal),",
                                  "normalize(directionalLightDirection[i]));",

            // With wrapAround, light intensity drops to 0 only directly
            // opposite the light, rather than perpendicular and beyond.
            "if (wrapAround > 0.0) {",
              "intensity = 0.5 + 0.5 * intensity;",
            "}",
            "intensity = clamp(intensity, 0.0, 1.0);",

            "faceColor += directionalLightColor[i] * intensity;",
          "}",
        "#endif",

        // Show surface normal in place of computed color.
        "if (normalShading > 0.0) {",
          "if (wrapAround > 0.0) {",
            "faceColor = vec3(0.5) + 0.5 * normal;",
          "} else {",
            "faceColor = normal;",
          "}",
        "}",

        // Highlight edges
        "if (edgeHighlight > 0.0) {",
          "float depthFactor = clamp(gl_FragCoord.z / gl_FragCoord.w * 0.003, 0.0, 1.0);",
          "vec3 newEdgeColor = mix(edgeColor, faceColor, depthFactor * edgeAttenuation);",
          "faceColor = mix(newEdgeColor, faceColor, edgeFactor());",
        "}",

        "gl_FragColor = vec4(faceColor, 1.0);",
    "}"
  ].join("\n")
};

/**
 * Compiles the shader into a THREE.Material for use in meshes.
 */
BigShaderMaterial = new THREE.ShaderMaterial({
  side: THREE.DoubleSide,
  lights: true,
  attributes: BigShader.attributes,
  uniforms: THREE.UniformsUtils.merge([
    THREE.UniformsLib.lights,
    BigShader.uniforms,
  ]),
  vertexShader: BigShader.vertexShader,
  fragmentShader: BigShader.fragmentShader
});