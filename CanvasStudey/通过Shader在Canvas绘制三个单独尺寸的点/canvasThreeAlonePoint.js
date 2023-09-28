//import { loadFile } from "../../examples/examples/lib/loadFile";
// import vertShader from'./shader/point.vert';
// import fragShader from './shader/point.frag';
const shaderPath='./shader/point';
function initVertexBuffers(gl){
    const vertices=new Float32Array([
        0.0,0.5,-0.5,-0.5,0.5,-0.5
    ]);
    const n=3;//顶点数量
    const sizes=new Float32Array([
        10.0,20.0,30.0//点的尺寸
    ]);

    const verextBuffer=gl.createBuffer();
    const sizeBuffer=gl.createBuffer();
    if(!verextBuffer)
    {
        console.log('创建buffer失败');
        return -1;
    }
     //将缓冲区对象绑定到目标
    gl.bindBuffer(gl.ARRAY_BUFFER,verextBuffer);
    //
    gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);
     //获取attribute变量的存储地址,通过地址修改着色器变量
    /**gl.getAttribLocation(program,name)
     * 其中program形参为指定包含顶点着色器和片元着色器的着色器程序对象
     * name形参为指定想要获取其存储地址的attribute变量的名称
     * 如果返回值大于等于0，则该值为attribute变量的存储地址
     * -1即小于0，则指定的attribute变量不存在，或者命名具有gl_
     */
    const a_Position=gl.getAttribLocation(gl.program,'a_Position');
    if(a_Position<0)
    {
        console.log('获取a_Position失败');
        return -1;
    }
    gl.vertexAttribPointer(a_Position,2,gl.FLOAT,false,0,0);
    gl.enableVertexAttribArray(a_Position);
    //将顶点尺寸写入缓冲区对象并开启
    gl.bindBuffer(gl.ARRAY_BUFFER,sizeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,sizes,gl.STATIC_DRAW);
    const a_PointSize=gl.getAttribLocation(gl.program,'a_PointSize');
    if(a_PointSize<0)
    {
        console.log('获取a_PointSize失败');
        return -1;
    }
    gl.vertexAttribPointer(a_PointSize,1,gl.FLOAT,false,0,0);
    gl.enableVertexAttribArray(a_PointSize);
    return n;
}
const ANGLE=90;
function main() {
    const vertStr=loadFile(`${shaderPath}.vert`);
    const fragStr=loadFile(`${shaderPath}.frag`);
    //通过id获取画布元素
    let mainCanvas = document.getElementById('main');
    //获取WebGL绘图上下文
    let gl = getWebGLContext(mainCanvas);
    if (!gl) {
        console.log('获取上下文失败');
        return;
    }
    //初始化着色器
    if(!initShaders(gl,vertStr,fragStr))
    {
        console.log('初始shader失败');
        return;
    }
    let n=initVertexBuffers(gl);
    console.log('n值为',n);
    //const u_xformMatrix=gl.getUniformLocation(gl.program,'u_xformMatrix');
    //gl.uniformMatrix4fv(location,transpose,array)函数,将array表示的4x4矩阵分配给用location指定的uniform变量
    //location uniform变量的存储位置
    //Transpose 在WebGL中必须指定为false 因为该参数表示是否转置矩阵。转置操作将交换矩阵的行和列，webGL实现没有提供矩阵转置的方法，所以该参数必须设为false
    //array 待传输的类型化数组，4x4矩阵按列主序存储在其中
    //gl.uniformMatrix4fv(u_xformMatrix,false,xformMatrix);
    
    let a_Position=gl.getAttribLocation(gl.program,'a_Position');
    if(a_Position<0)
    {
        console.log('获取a_Position变量地址失败');
        return;
    }
    //将顶点位置传输给attribute变量
    gl.vertexAttrib3f(a_Position,0.0,0.0,0.0);
    //指定清空<canvas>的颜色
    gl.clearColor(0.0,0.0,0.0,1.0);
    /**清空<canvas> WebGL中的gl.clear()方法实际上继承自OpenGL
     * ,它基于多基本缓冲区模型，清空绘图区域，实际上是在清空颜色缓冲区(color Buffer)
     * 传递参数gl.COLOR_BUFFER**/
    gl.clear(gl.COLOR_BUFFER_BIT);
    //绘制
    gl.drawArrays(gl.POINTS,0,n);
    
}
