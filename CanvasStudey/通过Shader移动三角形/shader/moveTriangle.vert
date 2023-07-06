attribute vec4 a_Position;//存储限定符变量
uniform vec4 u_Translation;
void main(){
    gl_Position=a_Position+u_Translation;
};

