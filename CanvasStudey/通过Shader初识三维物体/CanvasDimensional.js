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
    if(n<0)
    {
        console.log('获取顶点错误');
        return;
    }
    //清除颜色
    gl.clearColor(0, 0, 0, 1);
    //复合矩阵推演过程
    //平移之后旋转的坐标=坐标x平移矩阵x旋转矩阵
    //平移之后旋转的坐标=坐标x（平移矩阵x旋转矩阵）
    //这种方法，是将这些变换全部复合成一个等效的变换，
    //就得到了模型变换，或称之为建模变化，而（平移矩阵x旋转矩阵）这种复合矩阵也叫做模型矩阵
    const u_ViewMatrix=gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    const u_ModelMatrix=gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if(!u_ViewMatrix || !u_ModelMatrix)
    {
       console.log('读取Shader矩阵变量失败');
       return;
    }
    const viewMatrix=new Matrix4();
    viewMatrix.setLookAt(0.20, 0.25, 0.25, 0, 0, 0, 0, 1, 0);

    const modelMatrix=new Matrix4();
    modelMatrix.setRotate(-10, 0, 0, 1);

    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, n);
    
}
