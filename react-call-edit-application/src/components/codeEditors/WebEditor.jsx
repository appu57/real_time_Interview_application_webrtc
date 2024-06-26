import React, { useState, useRef, useCallback } from 'react';

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
import { LuMoveLeft } from "react-icons/lu";
import { GrRefresh } from "react-icons/gr";
import { useSocket } from '../../contexts/SocketContext'


const WebEditor = () => {

    const [html, setHtml] = useState('');
    const [css, setCSS] = useState('');
    const [js, setJS] = useState('');
    const lookup = {
        'setHtml': setHtml,
        'setCSS': setCSS,
        'setJS': setJS
    };
    const socket = useSocket();
    const htmlRef = useRef(null);
    const cssRef = useRef(null);
    const jsRef = useRef(null);
    const fetchUserCodeChanges = useCallback((e) => {
        const fetchTheSetter = lookup[e.cb];
        fetchTheSetter(e.value);
    }, [socket])
    useEffect(() => {
        if (socket) {
            socket.on('code_changes_acceped', fetchUserCodeChanges);
            return () => {
                socket.off('code_changes_acceped', fetchUserCodeChanges);
            }
        }

    }, [socket, fetchUserCodeChanges]);
    const src = `<html>
     <body>${html}</body>
     <style>${css}</style>
     <script>${js}</script>
    </html>`
    return (
        <div className="codeeditor__page__container">

            <div className="editor__page__container">

                <div className="editor__page--html" >
                    <Editor language="xml" displayName="HTML" value={html} onchange={setHtml} name='setHtml' />
                </div>
                <div className="editor__page--css">
                    <Editor language="css" displayName="CSS" value={css} onchange={setCSS} name='setCSS' />

                </div>
                <div className="editor__page--js">
                    <Editor language="javascript" displayName="JAVASCRIPT" value={js} onchange={setJS} name='setJS' />
                </div>
            </div>
            <div className="results__container">
                <header className="header__container">
                    {/* <div className="domain__container">
                    <div className="icon__container">
                        <LuMoveLeft />
                        <GrRefresh />
                    </div>
                    <div className="domain__url">
                        <div className="url__container">
                            <p>http://localhost:3001</p>
                        </div>
                    </div>
                    <div className="right__icon__container">

                    </div>
                </div> */}
                </header>
                <div className="iframe__container">
                    <iframe srcDoc={src} sandbox="allow-scripts" title="output" frameBorder="0" width="100%" height="100%"></iframe>
                </div>
            </div>
        </div>
    );
}
export default WebEditor;