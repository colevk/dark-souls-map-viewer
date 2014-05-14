attribute float vertexNumber;

varying vec3 vNormal;
varying vec3 vBC;

void main() {
    vNormal = normal;
    vBC = vec3(0.0);
    if (vertexNumber < 0.5) {
        vBC.x = 1.0;
    } else if (vertexNumber < 1.5) {
        vBC.y = 1.0;
    } else {
        vBC.z = 1.0;
    }

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}