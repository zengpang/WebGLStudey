attribute vec4 a_position;
attribute vec4 a_Color;
uniform mat4 u_ViewMatrix;
varying vec4 v_Color;
void main() {
    gl_Position = u_ViewMatrix * a_position;
    v_Color = a_Color;
}