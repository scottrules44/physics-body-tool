import React, {useState, useRef} from "react";
import Matter, { World } from "matter-js";

export default function BodyTest({mode, image, dots, wireframe, baseImage}){
    
    var wHPadding = 100;
    var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite;


    // create an engine
    var engine = Engine.create();
    
    

    var canvas = document.getElementById('canvas_test');
    var editorImg = document.getElementById('editor_image');
    function getDotWH(){
        var xs = [];
        var ys = [];
        dots.forEach( e => {
            xs.push(e.x);
            ys.push(e.y);
        });
        var minX = (Math.min(...xs));
        var maxX = (Math.max(...xs));
        var minY = (Math.min(...ys));
        var maxY = (Math.max(...ys));
        if(minX < 0){
            minX =0;
        }
        if(minY < 0){
            minY =0;
        }
        
        if(maxX > editorImg.width){
            maxX =editorImg.width;
        }
        if(maxY > editorImg.height){
            maxY =editorImg.height;
        }
        return [maxX+5, minX, maxY+5, minY]
    }
    
    if(mode == "test" && canvas && editorImg && image){  

        var render = Render.create({
            element: window.document.getElementById("editor"),
            engine: engine,
            canvas: canvas,
            options: {
                width: editorImg.width+wHPadding,
                height: editorImg.height+wHPadding,
                wireframes: wireframe,
              }
        });
        
       
        
        // create two boxes and a ground
        if(dots && dots.length > 2){
            var wH = getDotWH();
            var scale = Math.min((editorImg.width) / baseImage.width, (editorImg.height) / baseImage.height);
            var x = wH[1]+50
            var y = wH[3]+50
            var boxA = Bodies.fromVertices( x, y, dots, { 
                    isStatic: true,
                });
            
            boxA.position.x = boxA.bounds.min.x;
            boxA.position.y = boxA.bounds.min.y;
            boxA.positionPrev.x = boxA.bounds.min.x;
            boxA.positionPrev.y = boxA.bounds.min.y;
            
            Matter.Body.set(boxA, "position", {x: x, y: y})
            var x2 = (((wH[0]-wH[1]))*.5)+wH[1]+50
            var y2 = ((wH[2]-wH[3])*.5)+wH[3]+50
            boxA.position.x = x2;
            boxA.position.y = y2;
            boxA.positionPrev.x = x2;
            boxA.positionPrev.y = y2;
            
            
            var boxB = Bodies.rectangle(250,250, 400, 400, { 
                isStatic: true,
                isSensor: true,
                render:
                {
                    sprite:
                    {
                        texture: URL.createObjectURL(image),
                        xScale:scale,
                        yScale:scale,
                    }
                }
            });
            
                
            Composite.add(engine.world, [boxA, boxB]);
        }else{
            alert("You need place at least three dots to test");
        }
        
        
        
        var mouse = Matter.Mouse.create(render.canvas);
        let mouseConstraint = Matter.MouseConstraint.create(engine, {
            mouse:mouse,
            constraint: {
              render: {
                visible: false
              }
            }
        });
        
        Matter.Events.on(mouseConstraint, 'mousedown', function(event) {
            const x = event.mouse.position.x
            const y = event.mouse.position.y
            var ball = Bodies.circle( x, y, 5);
            World.add(engine.world, ball);
        })
        Composite.add(engine.world, [mouseConstraint]);
        Render.run(render);
        var runner = Runner.create();
    
        // run the engine
        Runner.run(runner, engine);

        canvas.style.marginLeft = "auto";
        canvas.style.marginRight = "auto";
        canvas.style.display = "block";
        editorImg.style.display = "none";
    }else if(canvas && editorImg){
        canvas.style.display = "none";
        editorImg.style.display = "block";
    }
    
    return(
        <>
        </>
    )
}