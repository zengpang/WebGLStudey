//Shader路径
const shaderPath = './shader/trianglesRotate';
//WebGL绘图上下文
let gl = null;
//u_FragColor
let u_FragColor = null;
let g_points = [];//鼠标点击位置数组
let g_colors = [];//存储点颜色数组
//创建缓冲区对象
let vertexBuffer = null;

function main() {
    const vertStr = loadFile(`${shaderPath}.vert`);
    const fragStr = loadFile(`${shaderPath}.frag`);
    //通过id获取画布元素
    const mainCanvas = document.getElementById('main');
    gl = getWebGLContext(mainCanvas);
    if (!gl) {
        console.log('获取GL失败');
        return;
    }
    if (!initShaders(gl, vertStr, fragStr)) {
        console.log('初始shader失败');
        return;
    }
    const n=initVertexBuffers(gl);
    if(n<0)
    {
        console.log(`读取顶点数据失败`);
        return;
    }
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    const u_ViewMatrix=gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    if(!u_ViewMatrix)
    {
       console.log('读取矩阵失败');
    }
    const viewMatrix=new Matrix4();
    document.onkeydown=function(ev){
        keydown(ev, gl, n, u_ViewMatrix, viewMatrix);
    }
    draw(gl, n, u_ViewMatrix, viewMatrix); 
}
function initVertexBuffers() {
    const verticesColors = new Float32Array([
        //顶点坐标和颜色
        0.0, 0.5, -0.4, 0.4, 1.0, 0.4,//最后一个绿色三角形
        -0.5, -0.5, -0.4, 0.4, 1.0, 0.4,
        0.5, -0.5, -0.4, 0.4, 1.0, 0.4,

        0.5, 0.4, -0.2, 1.0, 0.4, 0.4,//中间黄色三角形
        -0.5, 0.4, -0.2, 1.0, 1.0, 0.4,
        0.0, -0.6, -0.2, 1.0, 1.0, 0.4,

        0.0, 0.5, 0.0, 0.4, 0.4, 1.0,//第一个蓝色三角形
        -0.5, -0.5, 0.0, 0.4, 0.4, 1.0,
        0.5, -0.5, 0.0, 1.0, 0.4, 0.4,
    ])
    const n=9;
    const vertexColorbuffer=gl.createBuffer();
    if(!vertexColorbuffer)
    {
        console.log('创建流失败');
        return -1;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER,vertexColorbuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

    const FSIZE = verticesColors.BYTES_PER_ELEMENT;
    const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if(a_Position<0)
    {
        console.log('获取Shader变量a_Position失败');
        return -1;
    }

    gl.vertexAttribPointer(a_Position,3,gl.FLOAT,false,6*FSIZE,0);
    gl.enableVertexAttribArray(a_Position);
    const a_Color=gl.getAttribLocation(gl.program, 'a_Color');
    if(a_Color<0)
    {
        console.log('获取Shader变量a_Color失败');
        return -1;
    }
    gl.vertexAttribPointer(a_Color,3,gl.FLOAT,false,6*FSIZE,3*FSIZE);
    gl.enableVertexAttribArray(a_Color);
    return n;
}
//观察者坐标
let g_eyeX=0.20;
let g_eyeY=0.25;
let g_eyeZ=0.25;
//键盘控制
function keydown(ev,gl,n,u_ViewMatrix,viewMatrix){
     if(ev.keyCode==39)
     {
        g_eyeX+=0.01;
     }else if(ev.keyCode==37)
     {
        g_eyeX-=0.01;
     }else{
        return;
     }
     draw(gl, n, u_ViewMatrix, viewMatrix);
}
//绘制
function draw(gl,n,u_ViewMatrix,viewMatrix){
    viewMatrix.setLookAt(g_eyeX,g_eyeY,g_eyeZ,0,0,0,0,1,0);
    gl.uniformMatrix4fv(u_ViewMatrix,false,viewMatrix.elements);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES,0,n);
}