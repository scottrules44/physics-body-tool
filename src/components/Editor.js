import React, {useState, useRef} from "react";
import "../styles/Editor.css"
import Dots from "./Dots";
import Selector from "./Selector";
import random from "../modules/random";
import BodyTest from "./BodyTest";
export default function Editor(){
    const [imageSelected, setImageSelected] = useState(false);
    const [dots, editDots] = useState([]);
    const [mode, setMode] = useState("place");
    const [imageRender, setImageRender] = useState(false);
    const [baseImage, setBaseImage] = useState(null);
    const [showWireframe, setWireframe] = useState(false);
    const uploadImageRef = useRef(null);
    const imagePreviewRef = useRef(null);
    const importJsonRef = useRef(null);
    const dotW = 10;
    

    function dropHandler(ev) {
      // Prevent default behavior (Prevent file from being opened)
      ev.preventDefault();
      
      if (ev.dataTransfer.items && ev.dataTransfer.items[0] && ev.dataTransfer.items[0].getAsFile() ) {
        setImageSelected(ev.dataTransfer.items[0].getAsFile());
        ev.stopPropagation();
      } else if(ev.dataTransfer.files && ev.dataTransfer.files[0]) {
        setImageSelected(ev.dataTransfer.files[0]);
        ev.stopPropagation();
      }
    }
    function uploadImage(ev){
      if(uploadImageRef.current && uploadImageRef.current.files && uploadImageRef.current.files[0] ){
        setImageSelected(uploadImageRef.current.files[0]);
      }
    }
    function handleImageClick(e){
      var canvas = document.getElementById("editor_image");
      if(mode === "place" && canvas){
        
        const rect = canvas.getBoundingClientRect();
        const elementRelativeX = e.clientX - rect.left;
        const elementRelativeY = e.clientY - rect.top;
        const canvasRelativeX = elementRelativeX * canvas.width / rect.width;
        const canvasRelativeY = elementRelativeY * canvas.height / rect.height;
        
        editDots([...dots, {x: canvasRelativeX, y:canvasRelativeY, key:random(5), width:dotW, height:dotW}]);
      }
      e.preventDefault();
      e.stopPropagation();
    }
    function onDragEndHandler(ev) {
      
      ev.preventDefault();
    }
    function onDragEnterHandler(ev) {
      
      ev.preventDefault();
    }
    function handleDragOver(ev) {
      ev.preventDefault();
      ev.stopPropagation();
    };

    function loadImage(tempImage){
      
      var canvas = document.getElementById("editor_image");
      var context = canvas.getContext('2d');
      if(tempImage){
        
        var scale = Math.min(canvas.width / tempImage.width, canvas.height / tempImage.height);
        
        var x = (canvas.width / 2) - (tempImage.width / 2) * scale;
        var y = (canvas.height / 2) - (tempImage.height / 2) * scale;
        context.drawImage(tempImage, x, y, tempImage.width * scale, tempImage.height * scale);
        setBaseImage(tempImage)
      }
      
    }
    function reload(){
      var canvas = document.getElementById("editor_image");
      if(canvas){
        var context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        loadImage(baseImage);
      }
    }
    function filterXY(data){
      var newData = [];
      
      data.forEach( e => {
        newData.push({x:e.x, y:e.y})
      });
      return newData;
    }
    function convertXYToNum(data){
      var newData = [];
      if(baseImage != null){
        var width  = baseImage.naturalWidth;
        var height = baseImage.naturalHeight;
        data.forEach( e => {
          newData.push({x:e.x/width, y:e.y/height})
        });
        return {polygons:newData, imageSize:{width:width, height:height}};
      }
    }

    function clearImage(){
      setImageSelected(false);
      setBaseImage(null);
      editDots([]);
      setMode("place");
    }
    
    function importDots (ev){
      if(importJsonRef.current && importJsonRef.current.files && importJsonRef.current.files[0] ){
        var reader = new FileReader();
        reader.onload = function() {
          var fileContent = JSON.parse(reader.result);
          var width  = fileContent.imageSize.width;
          var height = fileContent.imageSize.height;
          var data = fileContent.polygons;
          var newData = [];
          data.forEach( e => {
            newData.push({x:e.x*width, y:e.y*height, key:random(5), width:dotW, height:dotW})
          });
          editDots(newData);
          reload();
          importJsonRef.current.value = ''; ;
        };
        reader.readAsText(importJsonRef.current.files[0]); 
      }
    }
       
    React.useEffect(() => {
      var canvas = document.getElementById("editor_image");
      
      if(imageSelected && imageRender == false && canvas){
        var context = canvas.getContext('2d');
        var tempImage;
        
        if(baseImage == null){
          tempImage = new Image();
          tempImage.onload = function(){   
            loadImage(tempImage);
          };
          tempImage.src = URL.createObjectURL(imageSelected);
          setBaseImage(tempImage);
        }else{
          tempImage = baseImage;
          loadImage(tempImage);
        }
        
      }
      
    }, [imageSelected, imageRender, setImageRender]);
   
    
    return (
        <div>
            { (() =>{
                if(imageSelected){
                  return(
                    <div>
                      <Selector mode={mode} changeMode={(m) => setMode(m)} />
                      <div style={{display: mode=="test"? "block":"none"}} >
                        <input type="checkbox" id="wireframe" name="wireframe" value="wireframe" onClick={() => setWireframe(!showWireframe)} checked={showWireframe} />
                        <label for="wireframe">Show Wireframe</label>
                      </div>
                      <div
                      id="editor"
                      onDragOver={(e) => {e.stopPropagation();e.preventDefault();}}
                      >
                        <canvas id="canvas_test" style={{display:"none"}} />
                        <BodyTest mode={mode} image={imageSelected} dots={filterXY(dots)} baseImage={baseImage} wireframe={showWireframe} />
                        <Dots data={dots} mode={mode} updateData={(d) => editDots(d)} reload={()=>reload()} />        
                        <canvas width={400} height={400} id="editor_image" className="editor_image" draggable={false} onDragStart={(e) =>{e.preventDefault();return false;}} className="editor_image" ref={imagePreviewRef} onClick={handleImageClick} />
                      </div>
                      {dots && dots.length <= 0 ?<h5>Click anywhere on image to place connecting dots</h5>: undefined}
                      <div>
                        <p><a href={'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(convertXYToNum(filterXY(dots))))} download="data.json">
                          <input type="button" value="export json" />
                        </a></p>
                        <p><input type="button" value="start over" onClick={clearImage} /> </p>
                        <p>Import Dots: <input type="file" ref={importJsonRef} style={{width: 180}} id="importJSON" name="import" accept="application/json" onChange={importDots} ></input></p>
                      </div>
                    </div>
                  )
                }else{
                  return(<div className="drop_zone" onDrop={dropHandler} onDragEnd={onDragEndHandler} onDragEnter={onDragEnterHandler} onDragOver={e => handleDragOver(e)}>
                            <p>Select or drag in an Image (pngs only)</p>
                            <input type="file" ref={uploadImageRef} style={{width: 180}} id="uploadImage" name="import" accept="image/png" onChange={uploadImage} ></input> 
                        </div>)
                }
            }) ()}
        </div>
        
    )
}