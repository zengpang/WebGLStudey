function main(){
    //通过id获取画布元素
    let mainCanvas=document.getElementById('main');
    //获取WebGL绘图上下文
    let gl=getWebGLContext(mainCanvas);
    if(!gl)
    {
        console.log('获取上下文失败');
        return;
    }
    //指定清空<canvas>的颜色
    gl.clearColor(0.0,0.0,0.0,1.0);
    /**清空<canvas> WebGL中的gl.clear()方法实际上继承自OpenGL
     * ,它基于多基本缓冲区模型，清空绘图区域，实际上是在清空颜色缓冲区(color Buffer)
     * 传递参数gl.COLOR_BUFFER**/
    gl.clear(gl.COLOR_BUFFER_BIT);
}