export default `
uniform float time;
varying float vOrder;

void main() {
    float span = abs(time - vOrder);

    if (span < 9.0) {
        float opacityTemp = (0.1 - span) * 10.0;
        gl_FragColor = vec4(0,1,1,opacityTemp);
    } else {
        gl_FragColor = vec4(0.4,0.4,0.4,1);
    }
}
`