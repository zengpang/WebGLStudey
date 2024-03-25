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
    
}