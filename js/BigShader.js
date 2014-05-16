BigShader = {

  attributes: {

    "vertexNumber": { type: 'f' }

  },

  uniforms: {

    "edgeColor":     { type: "v3", value: new THREE.Vector3(0, 0, 0) },
    "edgeHighlight": { type: "f", value: 0.0 },
    "wrapAround":    { type: "f", value: 1.0 },
    "normalShading": { type: "f", value: 0.0 }

  },

  vertexShader: [

    "attribute float vertexNumber;",

    "varying vec3 vNormal;",
    "varying vec3 vBC;",

    "void main() {",

      "vNormal = normal;",
      "vBC = vec3(0.0);",

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
    "uniform float wrapAround;",
    "uniform float normalShading;",

    "uniform vec3 ambientLightColor;",

    "#if (MAX_DIR_LIGHTS > 0)",
      "uniform vec3 directionalLightDirection[MAX_DIR_LIGHTS];",
      "uniform vec3 directionalLightColor[MAX_DIR_LIGHTS];",
    "#endif",

    "varying vec3 vNormal;",
    "varying vec3 vBC;",

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

        "vec3 faceColor = ambientLightColor;",

        "#if (MAX_DIR_LIGHTS > 0)",
          "for (int i = 0; i < MAX_DIR_LIGHTS; i++) {",
            "float intensity = dot(normalize(normal),",
                                  "normalize(directionalLightDirection[i]));",

            "if (wrapAround > 0.0) {",
              "intensity = 0.5 + 0.5 * intensity;",
            "}",
            "intensity = clamp(intensity, 0.0, 1.0);",

            "faceColor += directionalLightColor[i] * intensity;",
          "}",
        "#endif",

        "if (normalShading > 0.0) {",
          "if (wrapAround > 0.0) {",
            "faceColor = vec3(0.5) + 0.5 * normal;",
          "} else {",
            "faceColor = normal;",
          "}",
        "}",

        "if (edgeHighlight > 0.0) {",
          "faceColor = mix(edgeColor, faceColor, edgeFactor());",
        "}",

        "gl_FragColor = vec4(faceColor, 1.0);",

    "}"

  ].join("\n")

};


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