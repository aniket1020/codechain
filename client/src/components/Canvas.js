import React, { useEffect, useRef} from 'react';

const Canvas = () => {

    const canvasRef=useRef(null);
    const ctxRef=useRef(null);
    const height=useRef(null);
    const width=useRef(null);

    useEffect(()=>{
        const cvs=canvasRef.current;
        cvs.width=window.innerWidth;
        cvs.height=window.innerHeight;
        cvs.style.width='1000px';
        cvs.style.height='800px'
        width.current=cvs.width;
        height.current=cvs.height;
        const ctx=cvs.getContext('2d');
        ctxRef.current=ctx;
        generateRandomNFT();
    })

    let curve,randomCurve;

    const drawTree=(startX, startY, len, angle, branchWidth, color1, color2)=>{
        ctxRef.current.beginPath();
        ctxRef.current.save();

        ctxRef.current.strokeStyle = color1;
        ctxRef.current.fillStyle = color2;
        ctxRef.current.shadowBlur = 5;
        ctxRef.current.shadowColor = 'rgba(0,0,0,0.5)';

        ctxRef.current.lineWidth = branchWidth;
        ctxRef.current.translate(startX,startY);
        ctxRef.current.rotate(angle*Math.PI/180);
        ctxRef.current.moveTo(0,0);
        // ctx.lineTo(0,-len);
        if(angle > 0){
            ctxRef.current.bezierCurveTo(randomCurve,-len/2,-randomCurve,-len/2,0,-len);
        }
        else {
            ctxRef.current.bezierCurveTo(randomCurve,-len/2,-randomCurve,-len/2,0,-len);
        }
        ctxRef.current.stroke();

        if(len < 13){
            ctxRef.current.beginPath();
            ctxRef.current.arc(0,-len,10,0,Math.PI/2);
            ctxRef.current.fill();
            ctxRef.current.restore();
            return;
        }

        curve = (Math.random()*10)+25;

        drawTree(0,-len,len*0.75,angle+curve,branchWidth*0.7);
        drawTree(0,-len,len*0.75,angle-curve,branchWidth*0.7);

        ctxRef.current.restore();
    }


    const generateRandomNFT=()=>{
        ctxRef.current.clearRect(0,0,width.current,height.current);
        let centerPointX = width.current/2;
        let len = Math.floor((Math.random()*20)+200);
        let angle = Math.random()*10;
        let branchWidth = (Math.random()*100)+1;
        let color1 = 'rgb('+Math.random()*255+','+Math.random()*255+','+Math.random()*255+')';
        let color2 = 'rgb('+Math.random()*255+','+Math.random()*255+','+Math.random()*255+')';
    
        randomCurve = Math.random()*50;
        
        buttonColor(color1,color2);
        drawTree(centerPointX,height.current-80,len,angle,branchWidth,color1,color2);
    }

    const buttonColor=(color1,color2)=>{
        const b1=document.querySelector('.b1');
        //const b2=document.querySelector('.b2');
        b1.style.backgroundColor=color1;
       //b2.style.backgroundColor=color2;
    }

    return (
        <div>
            <canvas style={{width:"900px",height:"800px"}} ref={canvasRef}></canvas>
            <div className="nftButtons">
                <button className="generateTree b1">Accept NFT</button>
            </div>    
        </div>
        
    );
};

export default Canvas;