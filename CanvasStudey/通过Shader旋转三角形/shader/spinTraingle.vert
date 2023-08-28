attribute vec4 a_Position;//存储限定符变量
uniform vec4 u_CosB,u_sinB;//存储旋转角度
void main(){
    gl_Position.x=a_Position.x*u_CosB-a_Position.y*u_sinB;
    gl_Position.y=a_Position.x*u_sinB+a_Position.y*u_CosB;
    gl_Position.z=a_Position.z;
    gl_Position.w=1.0;
    //由4个分量组成的矢量被称为齐次坐标
    //齐次坐标使用如下的符号描述:(x,y,z,w)。
    //齐次坐标(x,y,z,w)等价于三维坐标(x/w,y/w,z/w)。所以如果齐次坐标的第4个分量是1，你就可以将它当做三维坐标来实现
    //w的值必须是大于等于0的。如果w趋近于0，那么它所标识的点将趋近无穷远，所以在齐次坐标系中可以有无穷的概念。
    //齐次坐标的存在，使得用矩阵乘法（下一章介绍）来描述顶点变换成为可能，三维图形系统在计算过程中，通常使用齐次坐标来表示顶点的三维坐标
}