export default `
uniform float time;
varying float vOrder;

void main() {
    float newOrder = vOrder - time;
    float yu = newOrder - 5.0 * floor(newOrder/5.0);
    if (yu < 2.0) {
        discard;
    }
    gl_FragColor = vec4(1.0,1.0,1.0,0.8);
}
`