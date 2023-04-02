function main(){
    //通过id获取画布元素
    const mainCanvas=document.getElementById('example');
    //获取上下文(context)的机制以进行绘图
    //,getContext中的形参指定上下文绘制类型，2d为绘制类型为二维图形
    const ctx=mainCanvas.getContext('2d');
    ctx.fillStyle='rgba(0,0,255,1.0)';//设置填充颜色为蓝色
    ctx.fillRect(120,10,150,150);//用这个颜色填充矩形

}