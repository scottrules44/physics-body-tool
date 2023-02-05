import React, {useEffect} from "react";
import Editor from "../components/Editor";
import "../styles/Home.css"
export default function Home(){
    useEffect(() => {
        document.title = 'Physics Body Tool';
      });
    return (
    <>
        <div>
            <h1 className="title">Physics Body Tool</h1>
        </div>
        <Editor/>
    </>
    );
}