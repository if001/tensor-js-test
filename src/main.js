var canvas = document.getElementById('canvassample'),
    ctx = canvas.getContext('2d'),
    moveflg = 0,
    Xpoint,
    Ypoint;


//初期値（サイズ、色、アルファ値）の決定
var defSize = 3,
    defColor = "#555";

// PC対応
canvas.addEventListener('mousedown', startPoint, false);
canvas.addEventListener('mousemove', movePoint, false);
canvas.addEventListener('mouseup', endPoint, false);
// スマホ対応
canvas.addEventListener('touchstart', startPoint, false);
canvas.addEventListener('touchmove', movePoint, false);
canvas.addEventListener('touchend', endPoint, false);

function startPoint(e){
    e.preventDefault();
    ctx.beginPath();

    Xpoint = e.layerX;
    Ypoint = e.layerY;

    ctx.moveTo(Xpoint, Ypoint);
}

function movePoint(e){
    if(e.buttons === 1 || e.witch === 1 || e.type == 'touchmove'){
        Xpoint = e.layerX;
        Ypoint = e.layerY;
        moveflg = 1;

        ctx.lineTo(Xpoint, Ypoint);
        ctx.lineCap = "round";
        ctx.lineWidth = defSize * 2;
        ctx.strokeStyle = defColor;
        ctx.stroke();
    }
}

function endPoint(e){
    if(moveflg === 0){
        ctx.lineTo(Xpoint-1, Ypoint-1);
        ctx.lineCap = "round";
        ctx.lineWidth = defSize * 2;
        ctx.strokeStyle = defColor;
        ctx.stroke();
    }
    moveflg = 0;
}

function clearCanvas(){
    ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);    
}


const tmpCanvas = document.getElementById('tmpcanvas').getContext('2d');
function to_1d_array(width,height){
    var gray_arr = new Array( width*height );
    var gray_ind = 0;

    tmpCanvas.clearRect(0, 0, width, height);
    tmpCanvas.drawImage(canvas, 0, 0, width, height);
    var src = tmpCanvas.getImageData(0,0,width,height).data;
    
    for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
            var idx = (j + i * width) * 4;
            //console.log(idx);
            var r = src[idx]; //赤
            var g = src[idx+1]; //緑
            var b = src[idx+2]; //青

            var gray = (r+g+b)/3;

            gray_arr[gray_ind] = gray;
            gray_ind += 1;
        }
    }
    return gray_arr
}

var model
window.onload = function(){
    model = tf.loadModel('http://localhost:1234/model.json');
}

function learn(){
    arr = to_1d_array(28,28);
    //console.log(arr);

    inp=tf.tensor(arr);
    inp = inp.reshape([1,784]);

    model.then((model) => {
	predict = model.predict(inp);
	//console.log(predict.print());
	html_arr = predict.dataSync();
	
	for(var i=0,l=html_arr.length;i<l;i++){
	    document.getElementById("predict"+i.toString()).innerHTML = html_arr[i].toFixed(4);
	}
	clearCanvas();
    });
}


function draw(src) {
    var img = new Image();
    img.src = src;
    img.onload = function() {
        ctx.drawImage(img, 0, 0);
    }
}
