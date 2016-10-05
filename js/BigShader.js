/**
 * Shader program that does edge detection and lambert shading, and accepts a
 * number of switches. Having everything together in one big shader with
 * switches is probably bad practice.
 */
BigShader = {
  uniforms: {
    "edgeColor":       { type: "c", value: new THREE.Color(0x000000) },
    "edgeHighlight":   { type: "i", value: 0 },
    "edgeAttenuation": { type: "i", value: 1 },
    "wrapAround":      { type: "i", value: 1 },
    "normalShading":   { type: "i", value: 0 }
  },

  vertexShader:
    "uniform int normalShading;\n" +

    "attribute float vertexNumber;\n" +

    "varying vec3 vNormal;\n" +
    "varying vec3 vBC;\n" +

    "void main() {\n" +
    "  if (normalShading == 1) {\n" +
    // Don't apply view matrix correction to normals if we want to display them
    // as colors. This would be inaccurate if any of the models were rotated or
    // scaled, but since none are, we can skip that.
    "    vNormal = normal;\n" +
    "  } else {\n" +
    "    vNormal = normalMatrix * normal;\n" +
    "  }\n" +

    // Convert vertex number to barycentric coordinates.
    "  if (vertexNumber == 0.0) {\n" +
    "    vBC = vec3(1.0, 0.0, 0.0);\n" +
    "  } else if (vertexNumber == 1.0) {\n" +
    "    vBC = vec3(0.0, 1.0, 0.0);\n" +
    "  } else {\n" +
    "    vBC = vec3(0.0, 0.0, 1.0);\n" +
    "  }\n" +

    "  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n" +
    "}\n"
  ,

  fragmentShader:
    "uniform vec3 edgeColor;\n" +
    "uniform int edgeHighlight;\n" +
    "uniform int edgeAttenuation;\n" +
    "uniform int wrapAround;\n" +
    "uniform int normalShading;\n" +

    "uniform vec3 ambientLightColor;\n" +

    "#if (MAX_DIR_LIGHTS > 0)\n" +
    "uniform vec3 directionalLightDirection[MAX_DIR_LIGHTS];\n" +
    "uniform vec3 directionalLightColor[MAX_DIR_LIGHTS];\n" +
    "#endif\n" +

    "varying vec3 vNormal;\n" +
    "varying vec3 vBC;\n" +

    // Calculates closeness to edge of triangle.
    "float edgeFactor() {\n" +
    "  vec3 d = fwidth(vBC);\n" +
    "  vec3 a3 = smoothstep(vec3(0.0), d, vBC);\n" +
    "  return min(min(a3.x, a3.y), a3.z);\n" +
    "}\n" +

    "void main() {\n" +
    "  vec3 normal = normalize(gl_FrontFacing ? vNormal : -vNormal);\n" +

    // Ambient lighting.
    "  vec3 faceColor = ambientLightColor;\n" +

    // Basic lambert shading for directional lights only.
    "  if (normalShading == 0) {\n" +
    "  #if (MAX_DIR_LIGHTS > 0)\n" +
    "    for (int i = 0; i < MAX_DIR_LIGHTS; i++) {\n" +
    "      float intensity = dot(normal, normalize(directionalLightDirection[i]));\n" +

    // With wrapAround, light intensity drops to 0 only directly opposite the
    // light, rather than perpendicular and beyond.
    "      if (wrapAround == 1) {\n" +
    "        intensity = 0.5 + 0.5 * intensity;\n" +
    "      }\n" +
    "      intensity = clamp(intensity, 0.0, 1.0);\n" +

    "      faceColor += directionalLightColor[i] * intensity;\n" +
    "    }\n" +
    "  #endif\n" +

    // Show surface normal in place of computed color.
    "  } else {\n" +
    "    if (wrapAround == 1) {\n" +
    "      faceColor = vec3(0.5) + 0.5 * normal;\n" +
    "    } else {\n" +
    "      faceColor = normal;\n" +
    "    }\n" +
    "  }\n" +

    // Highlight edges.
    "  if (edgeHighlight == 1) {\n" +
    "    float depthFactor = clamp(gl_FragCoord.z / gl_FragCoord.w * 0.003, 0.0, 1.0);\n" +
    "    vec3 newEdgeColor = mix(edgeColor, faceColor, depthFactor * float(edgeAttenuation));\n" +
    "    faceColor = mix(newEdgeColor, faceColor, edgeFactor());\n" +
    "  }\n" +

    "  gl_FragColor = vec4(faceColor, 1.0);\n" +
    "}\n"
};
