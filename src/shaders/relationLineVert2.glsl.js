export default `
attribute float order;

varying float vOrder;

void main() {
    vOrder = order;

    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
	gl_Position = projectionMatrix * mvPosition;
}
`
