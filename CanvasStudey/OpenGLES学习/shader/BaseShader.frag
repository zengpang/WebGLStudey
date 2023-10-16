#ifdef GLSL_ES //判断是否为
precision mediump float;
#endif
varying vec4 v_Color;
void main(){
    gl_FragColor = v_Color;
}
