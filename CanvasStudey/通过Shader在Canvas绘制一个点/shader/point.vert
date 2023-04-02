attribute vec4 a_Position;//存储限定符变量
void main(){
   gl_Position=a_Position;
   gl_PointSize=10.0;
}