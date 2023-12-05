//import { loadFile } from "../../examples/examples/lib/loadFile";
// import vertShader from'./shader/point.vert';
// import fragShader from './shader/point.frag';
const shaderPath='./shader/lookAtTriangles';
function initVertexBuffers(gl){
    const verticesColors=new Float32Array([
        0.0,  0.5,  -0.4,  0.4,  1.0,  0.4, //绿色三角形在最后面
        -0.5, -0.5,  -0.4,  0.4,  1.0,  0.4,
        0.5, -0.5,  -0.4,  1.0,  0.4,  0.4, 

        0.5,  0.4,  -0.2,  1.0,  0.4,  0.4, //黄色三角形在中间
        -0.5,  0.4,  -0.2,  1.0,  1.0,  0.4,
        0.0, -0.6,  -0.2,  1.0,  1.0,  0.4, 

        0.0,  0.5,   0.0,  0.4,  0.4,  1.0, //蓝色三角形在最前面
        -0.5, -0.5,   0.0,  0.4,  0.4,  1.0,
        0.5, -0.5,   0.0,  1.0,  0.4,  0.4, 
    ]);
    const n=9;
    const vertexColorsBuffer = gl.createBuffer();
    if(!vertexColorsBuffer)
    {
        console.log('创建buffer失败');
        return -1;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);
    const FSIZE = verticesColors.BYTES_PER_ELEMENT;
    const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if(a_Position<0)
    {
        console.log('读取Shader变量a_Position失败');
        return -1;
    }
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
    gl.enableVertexAttribArray(a_Position);

    const a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    if(a_Color<0)
    {
        console.log('获取Shader变量a_Color失败');
        return -1;
    }
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(a_Color);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
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
    const radian=Math.PI*ANGLE/180;//转为弧度制
    const cosB=Math.cos(radian);
    const sinB=Math.sin(radian);
    const tx=0.5;
    const ty=0.5;
    const tz=0.0;
    //复合矩阵推演过程
    //平移之后旋转的坐标=坐标x平移矩阵x旋转矩阵
    //平移之后旋转的坐标=坐标x（平移矩阵x旋转矩阵）
    //这种方法，是将这些变换全部复合成一个等效的变换，
    //就得到了模型变换，或称之为建模变化，而（平移矩阵x旋转矩阵）这种复合矩阵也叫做模型矩阵
    
    //注意WebGL中矩阵是列主序,列主序指的是从上往下计算
    const xformMatrix=new Matrix4();
    xformMatrix.setRotate(ANGLE,0,0,1);
    const u_xformMatrix=gl.getUniformLocation(gl.program,'u_xformMatrix');
    //gl.uniformMatrix4fv(location,transpose,array)函数,将array表示的4x4矩阵分配给用location指定的uniform变量
    //location uniform变量的存储位置
    //Transpose 在WebGL中必须指定为false 因为该参数表示是否转置矩阵。转置操作将交换矩阵的行和列，webGL实现没有提供矩阵转置的方法，所以该参数必须设为false
    //array 待传输的类型化数组，4x4矩阵按列主序存储在其中
    gl.uniformMatrix4fv(u_xformMatrix,false,xformMatrix.elements);
    
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
    gl.drawArrays(gl.TRIANGLES,0,n);
    
}
