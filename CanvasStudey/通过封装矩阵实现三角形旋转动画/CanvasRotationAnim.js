//import { loadFile } from "../../examples/examples/lib/loadFile";
// import vertShader from'./shader/point.vert';
// import fragShader from './shader/point.frag';
const shaderPath='./shader/rotatedTranslatedTriangle';
function initVertexBuffers(gl){
    const vertices=new Float32Array([
        0.0,0.5,-0.5,-0.5,0.5,-0.5

    ]);
    const n=3;//顶点数量
    const verextBuffer=gl.createBuffer();
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
    return n;
}
const ANGLE_STEP=45.0;
//注意WebGL中矩阵是列主序,列主序指的是从上往下计算
const modelMatrix=new Matrix4();
//三角形的当前旋转角度
let currentAngle=0.0;

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
    gl.clearColor(0.0,0.0,0.0,1.0);
    const u_ModelMatrix=gl.getUniformLocation(gl.program,'u_ModelMatrix');
    
  
   
    
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
    const tick=()=>{
        currentAngle=animate(currentAngle);//更新旋转角
        draw(gl,n,currentAngle,modelMatrix,u_ModelMatrix);
        //setInterval()函数与requestAnimationFrame()函数的区别
        //不管页面是否被激活,setInterval()函数都会被调用。但requestAnimationFrame()函数只有在标签页被激活的时候才会持续调用
        //并且requestAnimationFrame()函数无法指定重复调用的间隔
        //本质上requestAnimationFrame()类似于一个游览器重绘事件挂载函数,而对应的游览器重绘事件卸载函数为cancelAnimationFrame()
        requestAnimationFrame(tick);
    }
    tick();
    
}

const draw=(gl,n,currentAngle,modelMatrix,u_ModelMatrix)=>{
    //设置旋转矩阵
    modelMatrix.setRotate(currentAngle,0,0,1);
    
    //将旋转矩阵传输给顶点着色器
    gl.uniformMatrix4fv(u_ModelMatrix,false,modelMatrix.elements);
    //清除<canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
    //绘制三角形
    gl.drawArrays(gl.TRIANGLES,0,n);
    // const ANGLE=60;
    // const tx=0.5;
    // modelMatrix.setRotate(ANGLE,0,0,1);
    // modelMatrix.translate(tx,0,0);
    // const u_ModelMatrix=gl.getUniformLocation(gl.program,'u_ModelMatrix');
    // //gl.uniformMatrix4fv(location,transpose,array)函数,将array表示的4x4矩阵分配给用location指定的uniform变量
    // //location uniform变量的存储位置
    // //Transpose 在WebGL中必须指定为false 因为该参数表示是否转置矩阵。转置操作将交换矩阵的行和列，webGL实现没有提供矩阵转置的方法，所以该参数必须设为false
    // //array 待传输的类型化数组，4x4矩阵按列主序存储在其中
    // gl.uniformMatrix4fv(u_ModelMatrix,false,modelMatrix.elements);
}
//记录上一次调用函数的时刻
let g_last=Date.now();
const animate=(angle)=>{
    //计算距离上次调用经过多长的时间
    const now=Date.now();
    const elapsed=now-g_last;//毫秒
    g_last=now;
    //根据距离上次调用的时间，更新当前旋转角度
    let newAngle=angle+(ANGLE_STEP*elapsed)*0.001;
    return newAngle %=360;
}
