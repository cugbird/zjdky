export default `
uniform float time;
varying float vOrder;

void main() {
    float newOrder = vOrder - time;
    float yu = newOrder - 4.0 * floor(newOrder/4.0);
    if (yu < 0.8) {
        discard;
    }
    gl_FragColor = vec4(1.0,1.0,1.0,0.8);
}
`