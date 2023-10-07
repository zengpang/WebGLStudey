precision mediump float;//片元着色器必须加上精度描述。在片元着色器代码最前面加上这行代码
varying vec4 v_Color;//varying关键字表示将输出变量传递给片元着色器
void main(){
    gl_FragColor=v_Color;
}