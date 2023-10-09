//import { loadFile } from "../../examples/examples/lib/loadFile";
// import vertShader from'./shader/point.vert';
// import fragShader from './shader/point.frag';

const shaderPath='./shader/TexturedQuad';
function initVertexBuffers(gl){
    const verticesTexCoords=new Float32Array([
        -0.5,0.5,-0.3,1.7,
        -0.5,-0.5,-0.3,-0.2,
        0.5,0.5,1.7,1.7,
        0.5,-0.5,1.7,-0.2
    ]);
    const n=4;//顶点数量
   

    const vertexTexCoordBuffer=gl.createBuffer();
    
    if(!vertexTexCoordBuffer)
    {
        console.log('创建buffer失败');
        return -1;
    }
     //将缓冲区对象绑定到目标
    gl.bindBuffer(gl.ARRAY_BUFFER,vertexTexCoordBuffer);
    //
    gl.bufferData(gl.ARRAY_BUFFER,verticesTexCoords,gl.STATIC_DRAW);
    const FSIZE=verticesTexCoords.BYTES_PER_ELEMENT;
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
    gl.vertexAttribPointer(a_Position,2,gl.FLOAT,false,FSIZE*4,0);
    gl.enableVertexAttribArray(a_Position);

    //获取a_Color的存储位置，分配缓冲区并开启
    const a_TexCoord=gl.getAttribLocation(gl.program,'a_TexCoord');

    gl.vertexAttribPointer(a_TexCoord,2,gl.FLOAT,false,FSIZE*4,FSIZE*2);
    gl.enableVertexAttribArray(a_TexCoord);
    return n;
}
const ANGLE=90;
function initTextures(gl,n){
    const texture=gl.createTexture();//创建纹理对象
    if (!texture) {
        console.log('Failed to create the texture object');
        return false;
      }
    const u_Sampler=gl.getUniformLocation(gl.program,'u_Sampler');
    if (!u_Sampler) {
        console.log('Failed to get the storage location of u_Sampler');
        return false;
      }
    const image=new Image();//创建一个image对象
    if (!image) {
        console.log('Failed to create the image object');
        return false;
      }
    
      console.log('image',image);
    //注册图像加载事件的响应函数
    image.onload=function(){
        console.log('读取图片成功');
        loadTexture(gl,n,texture,u_Sampler,image);
    }
    image.src='./images/sky.jpg';
    return true;
}
function loadTexture(gl,n,texture,u_Sampler,image)
{
   gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,1);// 对纹理图形进行Y轴反转
   /**
    gl.activeTexture() 激活纹理单元
    WebGL通过一种称作纹理单元(texture unit)的机制来同时使用多个纹理。每个纹理单元有一个单元编号来管理一张纹理图像。即使你的程序只需要使用一张纹理图像。
    ，也得为其指定一个纹理单元。
    系统支持的纹理单元个数取决于硬件和游览器的WebGL实现，但是在默认情况下，WebGL至少支持8个纹理单元，一些其他的系统支持的个数更多。
    内置的变量gl.TEXTURE0各表示一个纹理单元
    */
   gl.activeTexture(gl.TEXTURE0);//开启0号纹理单元
   /**
    gl.bindTexture() 绑定纹理对象
    gl.bindTexture()方法的作用是告诉WebGL系统纹理对象使用的是那种类型的纹理。
    在对纹理对象进行操作之前，我们需要绑定纹理对象，这一点与缓冲区很像：在对缓冲区
    对象进行操作（如写入数据）之前，也需要绑定缓冲区对象。WebGL支持两种类型的纹理
    具体有两种纹理类型如下
    （1）gl.TEXTURE_2D 二维纹理
    （2）gl.TEXTURE_CUBE_MAP 立方体纹理
    */
   gl.bindTexture(gl.TEXTURE_2D,texture);//绑定纹理对象
   /**
    配置纹理对象的参数(gl.texParameteri(target,pname,param))
    通过gl.texParameteri()方法配置纹理图像映射到图形上的具体方式:
    如何根据纹理坐标获取纹素颜色，按哪种方式重复填充纹理。
    具体所需参数如下
    （1）target gl.TEXTURE_2D或gl.TEXTURE_CUBE_MAP
    （2）pname 纹理参数,具体的纹理参数如下
        (一) 放大方法(gl.TEXTURE_MAG_FILTER):这个参数表示，当纹理的绘制范围比纹理本身更大时，如何获取纹素颜色。
        (二) 缩小方法(gl.TEXTURE_MIN_FILTER):这个参数表示，当纹理的绘制范围比纹理本身更小时，如何获取纹素颜色。
        (三) 水平填充方法(gl.TEXTURE_WRAP_S):这个参数表示，如何对纹理图像左侧或右侧的区域进行填充
        (四) 垂直填充方法(gl.TEXTURE_WARP_T):这个参数表示，如何对纹理图像上方和下方的区域进行填充
    （3）param 纹理参数的值，具体的纹理参数如下
        (一) gl.NEAREST 使用原纹理上距离映射后像素(新像素)中心最近的那个像素的颜色值，作为新像素的值(使用曼哈顿距离)
        (二) gl.LINEAR 使用距离新像素中心最近的四个像素的颜色值的加权
    （4）错误 参数返回值为 INVALID_ENUM target不是合法的值
              INVALID_OFERATION 当前目标上没有绑定纹理对象      
        
    */
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);//配置纹理参数
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);//反转纹理
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
   /**
    将纹理图像分配给纹理对象(gl.texImage2D())
    我们使用gl.texImage2D()方法将纹理图像分配给纹理对象，同时该函数还允许告诉WebGL系统关于该图像的一些特性
    （1）target gl.TEXTURE_2D或gl.TEXTURE_CUBE_MAP
    （2）level 传入0(实际上,该参数是为金字塔纹理准备的)
    （3）internalformat 图像的内部格式
        (一) gl.RGB 红，绿，蓝
        (二) gl.RGBA 红，绿，蓝，透明度
        (三) gl.ALPHA (0.0,0.0,0.0,透明度)
        (四) gl.LUMINANCE L,L,L,1L:流明 
        (五) gl.LUMINANCE_ALPHA L,L,L,透明度
        这里的流明(LUMINANCE)表示我们感知到的物体表面的亮度。通常使用物体表面红，绿，蓝颜色分量值的加权平均来计算流明
    （4）format 纹理数据的格式，必须使用与internalformat相同的值
    （5）type 纹理数据的类型
        (一) gl.UNSIGNED_BYTE 无符号整型，每个颜色分量占据1字节
        (二) gl.UNSIGNED_SHORT_5_6_5 RGB:每个分量分别占据5，6，5比特
        (三) 
        (四) 
    （6）image 包含纹理图像的Image对象
      
    （7）错误 参数返回值为 INVALID_ENUM target不是合法的值
              INVALID_OFERATION 当前目标上没有绑定纹理对象  
     
    */
   gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,image);//配置纹理图像
   /**
    将纹理单元传递给片元着色器(gl.uniform1i())
    该方法将纹理传递给片元着色器并映射到图形的表面上去
    而片元着色器根据传入的纹理数据类型，接受的数据类型也不同，具体如下
    (一) gl.TEXTURE_2D纹理类型对应着色器纹理类型sampler2D
    (二) gl.TEXTURE_CUBE_MAP纹理数据类型对应着色器纹理类型samplerCube
    除了传递纹理之外gl.uniform1i()还需传入纹理单元编号
    */
   gl.uniform1i(u_Sampler,0);//将0号纹理传递给着色器中的取样器变量
   gl.clear(gl.COLOR_BUFFER_BIT);
   gl.drawArrays(gl.TRIANGLE_STRIP,0,n);//绘制矩形
}
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
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    if(!initTextures(gl,n))
    {
        console.log('纹理初始化失败');
        return;
    }
}
