attribute vec4 a_Position;//存储限定符变量
attribute float a_PointSize;
void main(){
   gl_Position=a_Position;
   gl_PointSize=a_PointSize;
}