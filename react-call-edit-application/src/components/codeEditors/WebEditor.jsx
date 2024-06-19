import React, { useState } from 'react';
import Codemirror from 'codemirror';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/css/css';
import 'codemirror/mode/xml/xml';
import 'codemirror/theme/dracula.css';
import { useEffect } from "react";
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/lib/codemirror.css';
import Editor from './Editor';

const WebEditor = () => {
    const [html,setHtml]=useState('');
    const [css,setCSS]=useState('');
    const [js,setJS]=useState('');
    return (
        <div className="editor__page__container">

            <div className="editor__page--html">
                <Editor language="xml" displayName="HTML" value={html} onchange={setHtml}/>
            </div>
            <div className="editor__page--css">
                <Editor language="css" displayName="CSS" value={css} onchange={setCSS} />

            </div>
            <div className="editor__page--js">
                <Editor language="javascript" displayName="JAVASCRIPT" value={js} onchange={setJS}/>
            </div>
        </div>

    );
}
export default WebEditor;