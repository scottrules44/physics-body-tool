import React, {useState, useRef} from "react";

export default function Selector({mode,changeMode}){

  return (
      <div style={{marginBottom:20}}>
          <input type="radio" id="place" name="mode" value="30" onClick={() => changeMode("place")} checked={mode=== "place"} />
          <label for="place">Place</label>
          <input type="radio" id="move" name="mode" value="60" onClick={() => changeMode("move")} checked={mode=== "move"} />
          <label for="move">Move</label>  
          <input type="radio" id="remove" name="mode" value="100" onClick={() => changeMode("remove")} checked={mode=== "remove"}/>
          <label for="remove">Remove</label>
          <input type="radio" id="test" name="mode" value="100" onClick={() => changeMode("test")} checked={mode=== "test"}/>
          <label for="test">Test</label>
      </div>
      
  )
}