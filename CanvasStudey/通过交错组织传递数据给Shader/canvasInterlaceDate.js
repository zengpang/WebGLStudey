//import { loadFile } from "../../examples/examples/lib/loadFile";
// import vertShader from'./shader/point.vert';
// import fragShader from './shader/point.frag';
const shaderPath='./shader/point';
function initVertexBuffers(gl){
    //定义顶点数组
    const verticesSizes=new Float32Array([
        0.0,0.5,10.0,//第一个点
        -0.5,-0.5,20.0,//第二个点
        0.5,-0.5,30.0//第三个点
    ]);
    const n=3;//顶点数量
  
    //创建缓冲区对象
    const verexSizeBuffer=gl.createBuffer();

    if(!verexSizeBuffer)
    {
        console.log('创建buffer失败');
        return -1;
    }
     //将缓冲区对象绑定到目标
    gl.bindBuffer(gl.ARRAY_BUFFER,verexSizeBuffer);
    //将顶点坐标和尺寸写入缓冲区并开启
    gl.bufferData(gl.ARRAY_BUFFER,verticesSizes,gl.STATIC_DRAW);
    //FSIZE存储每个元素的大小(字节数),其中BYTES_PER_ELEMENT为类型化数组具有的属性，表示可以从中获知数组中每个元素所占的字节数。
    const FSIZE=verticesSizes.BYTES_PER_ELEMENT;
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
    //vertexAttribPointer函数的作用是告诉显卡从当前绑定的缓冲区中读取顶点数据
    //其调用结构为gl.vertexAttribPointer(index, size, type, normalized, stride, offset);
    //index为欲修改的attribute变量存储地址,size表示变量是几维数据，type为变量的数据类型
    //normalized为是否进行归一化，true代表进行归一化，false则代表否定
    //stride数据一行的长度，offset指定顶点属性数组中第一部分的字节偏移量
    gl.vertexAttribPointer(a_Position,2,gl.FLOAT,false,FSIZE*3,0);
    gl.enableVertexAttribArray(a_Position);//开启分配
    //获取a_Position的存储位置，分配缓冲区并开启
    const a_PointSize=gl.getAttribLocation(gl.program,'a_PointSize');
    gl.vertexAttribPointer(a_PointSize,1,gl.FLOAT,false,FSIZE*3,FSIZE*2);
    gl.enableVertexAttribArray(a_PointSize);//开启缓冲区分配
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
