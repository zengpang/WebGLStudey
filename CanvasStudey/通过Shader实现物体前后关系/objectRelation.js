const shaderPath = './shader/objectRelation';
function main() {
    const vertStr = loadFile(`${shaderPath}.vert`);
    const fragStr = loadFile(`${shaderPath}.frag`);
    const canvas=document.getElementById('main');
    const gl=getWebGLContext(canvas);
    if(!gl)
    {
        console.log('画布上下文初始化失败');
        return;
    }
    if(!initShaders(gl,vertStr,fragStr))
    {
        console.log('着色器初始化失败');
        return;
    }
    const n=initVertexBuffers(gl);
    if(n<0)
    {
        console.log('顶点初始化失败');
        return;
    }
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    const u_ModelMatrix=gl.getUniformLocation(gl.program,'u_ModelMatrix');
    const u_ViewMatrix=gl.getUniformLocation(gl.program,'u_ViewMatrix');
    const u_ProjMatrix=gl.getUniformLocation(gl.program,'u_ProjMatrix');
    if(!u_ModelMatrix||!u_ViewMatrix||!u_ProjMatrix)
    {
        console.log('获取uniform矩阵变量失败');
        return;
    }
    const modelMatrix=new Matrix4();
    const viewMatrix=new Matrix4();
    const projMatrix=new Matrix4();
    modelMatrix.setTranslate(0.75,0,0);
    viewMatrix.setLookAt(0, 0, 5, 0, 0, -100, 0, 1, 0);
    projMatrix.setPerspective(30, canvas.width/canvas.height, 1, 100);
    
    gl.uniformMatrix4fv(u_ModelMatrix,false,modelMatrix.elements);
    gl.uniformMatrix4fv(u_ViewMatrix,false,viewMatrix.elements);
    gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES,0,n);
    modelMatrix.setTranslate(-0.75,0,0);
    gl.uniformMatrix4fv(u_ModelMatrix,false,modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLES,0,n);
}
function initVertexBuffers(gl){
    const verticesColors=new Float32Array([
        0.0,1.0,-4.0,0.4,1.0,0.4, // 绿色三角形在最后面
        
    ])
}