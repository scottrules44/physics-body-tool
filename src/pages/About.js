import React from "react";
import ReactMarkdown from 'react-markdown';
import Docs from '../markdown/docs.md'
export default function About(){
    const [docs,setDocs] = React.useState("Loading...");
    
        
    fetch(Docs)
    .then(r => r.text())
    .then(text => {
        setDocs(text);
    });
    
    return(
        <div>
            <ReactMarkdown children={docs} />
            <p>Made By Scott Harrison</p>
        </div>
    )
}