
var canvas = document.getElementById('canvas');
//设置绘图环境
var cxt = canvas.getContext('2d');

var pen = document.getElementById('pen');
var eraser = document.getElementById('eraser');
var actions = [pen, eraser];//这样是为了让pen和eraser中间只能选择一个

penOn(0);

function setStaus(Arr, num, type){
    for(var i=0; i<Arr.length; i++){
        if(i == num){
            Arr[i].style.background = 'yellow';
        }
        else{
            Arr[i].style.background = 'bisque';
        }
    }
}
function penOn(num){
    //pen的函数
    setStaus(actions,num,1)
    cxt.strokestyle = 'black';
    cxt.fillestyle = 'black';
    var flag = 0;
    canvas.onmousedown = function(evt){
        evt = window.event?window.event:evt;//存在则是IE，不存在则不是。这一步是整合鼠标事件，提升兼容性。
        var startX = evt.pageX - this.offsetLeft;
        var startY = evt.pageY - this.offsetTop;
        cxt.beginPath();
        cxt.moveTo(startX,startY);
        flag = 1;
    }
    canvas.onmousemove = function(evt){
        evt = window.event?window.event:evt;
        var endX = evt.pageX - this.offsetLeft;
        var endY = evt.pageY - this.offsetTop;
        //注意：这里需要提前判断一下鼠标是否已经按下，否则会有Bug
        if(flag){
            cxt.lineTo(endX,endY);
            cxt.stroke();
        }
        
    }
    canvas.onmouseup = function(){
        flag = 0;
        cxt.closePath();
    }
    canvas.onmouseout = function(){
        flag = 0;
        cxt.closePath();
    }
}
function eraserOn(num){
    setStaus(actions,num,1)
    flag = 0;
    canvas.onmousedown = function(evt){
        evt = window.event? window.event:evt;//存在则是IE，不存在则不是。这一步是整合鼠标事件，提升兼容性。
        var start1X = evt.pageX - this.offsetLeft;
        var start1Y = evt.pageY - this.offsetTop;
        cxt.clearRect(start1X-10,start1Y-10,20,20);//擦除专用函数
        flag = 1;
    }
    canvas.onmousemove = function(evt){
        evt = window.event?window.event:evt;
        var start1X = evt.pageX - this.offsetLeft;
        var start1Y = evt.pageY - this.offsetTop;
        
        //注意：这里需要提前判断一下鼠标是否已经按下，否则会有Bug
        if(flag){
            cxt.clearRect(start1X-10,start1Y-10,20,20);//擦除专用函数
        }
        
    }
    canvas.onmouseup = function(){
        flag = 0;
    }
    canvas.onmouseout = function(){
        flag = 0;
    }
}
function save(){
    var imageData = canvas.toDataURL();
    var b64 = imageData.substring(22);//从data协议的第22位开始取
    alert(imageData);
    var data = document.getElementById('data');
    data.value = b64;//将表单提交到后台
    var form = document.getElementById('myForm');
    form.submit();
}
function clearing(){
    cxt.clearRect(0,0,880,400);
}