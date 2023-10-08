attribute vec4 a_Position;//存储限定符变量
attribute vec4 a_Color;
varying vec4 v_Color;//varying关键字表示将输出变量传递给片元着色器
void main(){
   gl_Position=a_Position;
   v_Color=a_Color;
}