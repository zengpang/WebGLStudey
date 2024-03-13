const shaderPath = './shader/boxSpace';
function initVertexBuffers(gl) {
    const verticesColors = new Float32Array([
        // Vertex coordinates and color
        0.0, 0.6, -0.4, 0.4, 1.0, 0.4, // The back green one
        -0.5, -0.4, -0.4, 0.4, 1.0, 0.4,
        0.5, -0.4, -0.4, 1.0, 0.4, 0.4,

        0.5, 0.4, -0.2, 1.0, 0.4, 0.4, // The middle yellow one
        -0.5, 0.4, -0.2, 1.0, 1.0, 0.4,
        0.0, -0.6, -0.2, 1.0, 1.0, 0.4,

        0.0, 0.5, 0.0, 0.4, 0.4, 1.0, // The front blue one 
        -0.5, -0.5, 0.0, 0.4, 0.4, 1.0,
        0.5, -0.5, 0.0, 1.0, 0.4, 0.4,
    ]);
    const n=9;
    const vertexColorbuffer=gl.createBuffer();
    if(!vertexColorbuffer)
    {
        console.log('Failed to create the buffer object');
        return -1;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER,vertexColorbuffer);
    gl.bufferData(gl.ARRAY_BUFFER,verticesColors,gl.STATIC_DRAW);
    const FSIZE = verticesColors.BYTES_PER_ELEMENT;
    const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if(a_Position < 0) {
        console.log('读取a_position失败');
        return -1;
    }
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6,0);
    gl.enableVertexAttribArray(a_Position);
    const a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    if(a_Color < 0){
        console.log('读取a_Color变量失败');
        return -1;
    }
    gl.vertexAttribPointer(a_Color,3,gl.FLOAT,false,FSIZE * 6,FSIZE * 3);
    gl.enableVertexAttribArray(a_Color);
    gl.bindBuffer(gl.ARRAY_BUFFER,null);
    return n;
}
const g_near=0.0,g_far=0.5;
function keydown(ev,gl,nf,u_near,u_far,n) {
    switch(ev.keyCode)
    {
        
    }
}
function main() {
    const vertStr = loadFile(`${shaderPath}.vert`);
    const fragStr = loadFile(`${shaderPath}.frag`);
    const canvas = document.getElementById('main');
    const nf = document.getElementById('nearFar');
    const gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('读取画布上下文失败');
        return;
    }
    if (!initShaders(gl, vertStr, fragStr)) {
        console.log('初始shader失败');
        return;
    }
    const n = initVertexBuffers(gl);
    if (n < 0) {
        console.log('初始化顶点缓冲区失败');
        return;
    }

}