import React, {useState, useRef} from "react";
import random from "../modules/random";
export default function Dots({data, updateData, mode, reload}){
    const dotDrag = useRef();
    const [renderedDot, setRenderedDot] = useState([]);
    const [isDragging, setDragging] = useState(null);
    
    
    function drawLines(xA,yA,xB,yB, context)
    {
        context.beginPath();
        context.moveTo(xA, yA);
        context.lineTo(xB, yB);
        context.stroke();
        
    }
    function reloadCanvas(){
        reload();
        setRenderedDot([]);
        loadDots(true);
        
    }
    function loadDots(includeAll){
        
        data.forEach((dot, index, array) => {
            
            if((!renderedDot.includes(dot) || includeAll == true) && canvas){
                
                var context = canvas.getContext('2d');
                context.beginPath();
                context.ellipse(dot.x, dot.y, dot.width, dot.height, 0, 0, 2 * Math.PI)
                context.stroke();
                if(array[index-1]){
                    drawLines(dot.x, dot.y, array[index-1].x, array[index-1].y, context);
                }
                if(array.length >= 3 && array.length-1 == index){
                    drawLines(dot.x, dot.y, array[0].x, array[0].y, context);
                }
    
                setRenderedDot([...renderedDot, dot]);
            } 
            
        });
    }
    
    var canvas = document.getElementById("editor_image");
    function dotsClick(ev){
        const rect = canvas.getBoundingClientRect();
        var x = ev.clientX - rect.left;
        var y = ev.clientY - rect.top;
        
        var dotSelected = null;
        data.forEach((dot, index) => {
            var dotW = dot.width;
            var dotH = dot.height;
            var dotL = dot.x-dotW;
            var dotT = dot.y-dotH;
            
            if (y > dotT && y < (dotT + (dotH *2)) 
                && x > dotL && x < (dotL + (dotW*2)) ) {
                dotSelected = index;
            }
        })
        if(mode === "remove" && dotSelected != null){
            var tempData = data;
            tempData.splice(dotSelected, 1);
            updateData([...tempData]);
            reloadCanvas();
        }
        
    }
   
    if(canvas){
        canvas.onclick = (ev)=> {dotsClick(ev)};
        //drag
        canvas.onmousedown =  (ev)=> {
            if(isDragging == null && mode === "move"){
                const rect = canvas.getBoundingClientRect();
                var x = ev.clientX - rect.left;
                var y = ev.clientY - rect.top;
                data.forEach((dot, index) => {
                    var dotW = dot.width;
                    var dotH = dot.height;
                    var dotL = dot.x-dotW;
                    var dotT = dot.y-dotH;
                    if (y > dotT && y < (dotT + (dotH *2)) 
                        && x > dotL && x < (dotL + (dotW*2)) ) {
                        setDragging(index);
                    }
                })
            }
            
        };
        canvas.onmouseup =  (ev)=> {
            if(isDragging != null ){
                setDragging(null);
            }
        };
        canvas.onmousemove =  (ev)=> {
            if(isDragging != null && mode == "move"){
                var tempData = data;
                const rect = canvas.getBoundingClientRect();
                const elementRelativeX = ev.clientX - rect.left;
                const elementRelativeY = ev.clientY - rect.top;
                const canvasRelativeX = elementRelativeX * canvas.width / rect.width;
                const canvasRelativeY = elementRelativeY * canvas.height / rect.height;
                tempData[isDragging]= {x: canvasRelativeX, y:canvasRelativeY, key:random(5), width:10, height:10};
                updateData([...tempData]);
                reloadCanvas();
            }
        };
        canvas.onmouseout =  (ev)=> {
            if(isDragging != null ){
                setDragging(null);
            }
        };
        
    }
    loadDots(false);
    
    return(
        <></>
    )
}