//Shader路径
const shaderPath = './shader/triangle';
//WebGL绘图上下文
let gl = null;
//u_FragColor变量
let u_FragColor = null;
let g_points = [];//鼠标点击位置数组
let g_colors = [];//存储点颜色数组
//创建缓冲区对象
let vertexBuffer = null;
//绘制空心三角形
const borderTriangle=()=>{
    for(let i=1;i<=3;i++)
    {
        //其中gl.LINE_LOOP决定绘制方式为闭合线条
        gl.drawArrays(gl.LINE_LOOP,0,i);
    }
}

//缓冲区初始化
const bufferInit = (a_Position) => {
    const vertices = new Float32Array([
        0.0, 0.5, -0.5, -0.5, 0.5, -0.5
    ]);
    vertexBuffer = gl.createBuffer();
    //创建缓冲区对象
    if (!vertexBuffer) {
        console.log('创建缓冲区失败');
        return -1;
    }
    console.log(vertices);
    //将缓冲区对象绑定到目标
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    //向缓冲区对象中写入数据
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    //将缓冲区对象分配给attribute变量(gl.vertexAttribPointer())
    gl.vertexAttribPointer(a_Position,2,gl.FLOAT,false,0,0);
    //开启attribute变量(gl.enableVertex AttribArray()方法开启attribute变量),开启之后，会与vertexAttrib3产生冲突，从而导致鼠标点击绘制功能失效
    gl.enableVertexAttribArray(a_Position);
    //绘制空心三角形
    borderTriangle();
    //

}
const glClear = () => {
    //指定清空<canvas>的颜色
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    /**清空<canvas> WebGL中的gl.clear()方法实际上继承自OpenGL
  * ,它基于多基本缓冲区模型，清空绘图区域，实际上是在清空颜色缓冲区(color Buffer)
  * 传递参数gl.COLOR_BUFFER**/
    gl.clear(gl.COLOR_BUFFER_BIT);
}
const click = (ev, gl, canvas, a_Position) => {


    let x = ev.clientX;//鼠点击处的x坐标
    let y = ev.clientY;//鼠标点击处的y坐标
    //获取点击的方块
    let rect = ev.target.getBoundingClientRect();
    //rect.left，rect.top获取获取canvas在游览器的坐标，然后由于canvas内部即WebGL的坐标原点是居中即(canvas.width / 2,canvas.height / 2)
    x = ((x - rect.left) - canvas.height / 2) / (canvas.height / 2);
    y = (canvas.width / 2 - (y - rect.top)) / (canvas.width / 2);
    //将坐标存储到g_points中
    g_points.push([x, y]);
    //将点的颜色存储到g_colors数组中
    if (x >= 0.0 && y >= 0.0) //第一象限
    {
        g_colors.push([1.0, 0.0, 0.0, 1.0]);//红色
    } else if (x < 0.0 && y < 0.0) //第三象限
    {
        g_colors.push([0.0, 1.0, 0.0, 1.0]);//红色
    }
    else {
        g_colors.push([1.0, 1.0, 1.0, 1.0]);//红色
    }
    /**清空<canvas> WebGL中的gl.clear()方法实际上继承自OpenGL
* ,它基于多基本缓冲区模型，清空绘图区域，实际上是在清空颜色缓冲区(color Buffer)
* 传递参数gl.COLOR_BUFFER**/
    gl.clear(gl.COLOR_BUFFER_BIT);
    let len = g_points.length;
    for (let i = 0; i < len; i++) {
        let xy = g_points[i];
        let rgba = g_colors[i];
        console.log(rgba);
        //将点的位置传递到vert即顶点着色器文件中的变量a_Position
        gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
        //将点的颜色传输到frag即片元着色器文件中的变量u_FragColor
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        //绘制点
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}
const main = () => {
    const vertStr = loadFile(`${shaderPath}.vert`);
    const fragStr = loadFile(`${shaderPath}.frag`);

    //通过id获取画布元素
    let mainCanvas = document.getElementById('main');
    //获取WebGL绘图上下文
    gl = getWebGLContext(mainCanvas);
    if (!gl) {
        console.log('获取上下文失败');
        return;
    }
    //初始化着色器
    if (!initShaders(gl, vertStr, fragStr)) {
        console.log('初始shader失败');
        return;
    }
    //获取a_Position变量的存储位置
    let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    //获取u_FragColor变量的存储位置
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');


    //注册鼠标点击事件响应函数
    mainCanvas.onmousedown = (ev) => {
        click(ev, gl, mainCanvas, a_Position);
    }
   
    glClear();
    bufferInit(a_Position);
   

}
