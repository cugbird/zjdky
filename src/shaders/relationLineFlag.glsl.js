export default `
uniform float time;
varying float vOrder;

void main() {
    float span = abs(time - vOrder);

    if (span < 10.0) {
        float opacityTemp = 1.0 - (abs(5.0 - span) / 5.0);
        gl_FragColor = vec4(0.0,1.0,1.0,opacityTemp);
    } else {
        gl_FragColor = vec4(0.87,0.87,0.89,0.8);
    }
}
`