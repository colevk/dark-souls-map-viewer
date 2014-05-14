BigShader = {

  attributes: {

    "vertexNumber": { type: 'f' }

  },

  uniforms: {

    "edgeColor":     { type: "v3", value: new THREE.Vector3(0, 0, 0) },
    "edgeHighlight": { type: "f", value: true },
    "wrapAround":    { type: "f", value: true },
    "normalShading": { type: "f", value: true }

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

    "uniform vec3 directionalLightDirection[MAX_DIR_LIGHTS];",
    "uniform vec3 directionalLightColor[MAX_DIR_LIGHTS];",

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

        "vec3 faceColor = vec3(dot(normal, normalize(directionalLightDirection[0])));",

        "if (normalShading > 0.0) {",
            "faceColor = normal;",
        "}",

        "if (wrapAround > 0.0) {",
          "faceColor = vec3(0.5) + 0.5 * faceColor;",
        "}",

        "if (edgeHighlight > 0.0) {",
          "faceColor = mix(edgeColor, faceColor, edgeFactor());",
        "}",

        "gl_FragColor = vec4(faceColor, 1.0);",

    "}"

  ].join("\n")

};