const canvas = document.querySelector('canvas');
const generateButton = document.querySelector('.generateTree');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');

let curve,randomCurve;

function drawTree(startX, startY, len, angle, branchWidth, color1, color2){
    ctx.beginPath();
    ctx.save();

    ctx.strokeStyle = color1;
    ctx.fillStyle = color2;
    ctx.shadowBlur = 5;
    ctx.shadowColor = 'rgba(0,0,0,0.5)';

    ctx.lineWidth = branchWidth;
    ctx.translate(startX,startY);
    ctx.rotate(angle*Math.PI/180);
    ctx.moveTo(0,0);
    // ctx.lineTo(0,-len);
    if(angle > 0){
        ctx.bezierCurveTo(randomCurve,-len/2,-randomCurve,-len/2,0,-len);
    }
    else {
        ctx.bezierCurveTo(randomCurve,-len/2,-randomCurve,-len/2,0,-len);
    }
    ctx.stroke();

    if(len < 13){
        ctx.beginPath();
        ctx.arc(0,-len,10,0,Math.PI/2);
        ctx.fill();
        ctx.restore();
        return;
    }

    curve = (Math.random()*10)+25;

    drawTree(0,-len,len*0.75,angle+curve,branchWidth*0.7);
    drawTree(0,-len,len*0.75,angle-curve,branchWidth*0.7);

    ctx.restore();
}

function generateRandomNFT() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    let centerPointX = canvas.width/2;
    let len = Math.floor((Math.random()*20)+200);
    let angle = Math.random()*10;
    let branchWidth = (Math.random()*100)+1;
    let color1 = 'rgb('+Math.random()*255+','+Math.random()*255+','+Math.random()*255+')';
    let color2 = 'rgb('+Math.random()*255+','+Math.random()*255+','+Math.random()*255+')';

    randomCurve = Math.random()*50;

    generateButton.style.background = color1;

    drawTree(centerPointX,canvas.height-80,len,angle,branchWidth,color1,color2);
}

drawTree(canvas.width/2,canvas.height-80,200,0,20,'brown','green');
