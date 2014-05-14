#extension GL_OES_standard_derivatives : enable

uniform vec3 edgeColor;
uniform float edgeHighlight;
uniform float wrapAround;
uniform float normalShading;


varying vec3 vBC;

float edgeFactor() {
    vec3 d = fwidth(vBC);
    vec3 a3 = smoothstep(vec3(0.0), d, vBC);
    return min(min(a3.x, a3.y), a3.z);
}

void main() {
    vec3 normal;
    if (gl_FrontFacing) {
        normal = vNormal;
    } else {
        normal = -vNormal;
    }

    vec3 faceColor = vec3(dot(normal, normalize(directionalLightDirection[0])));

    if (normalShading > 0.0) {
        faceColor = normal;
    }

    if (wrapAround > 0.0) {
        faceColor = vec3(0.5) + 0.5 * faceColor;
    }

    if (edgeHighlight > 0.0) {
        faceColor = mix(edgeColor, faceColor, edgeFactor());
    }

    gl_FragColor = vec4(faceColor, 1.0);
}