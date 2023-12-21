function main(){
    const canvas=document.getElementById('main');
    const nf= document.getElementById('nearFar');
    const gl=getWebGLContext(canvas);
    if(!gl)
    {
        console.log('读取画布上下文失败');
        return;
    }
    
}