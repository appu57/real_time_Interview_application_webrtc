import React, { useState, useRef ,useCallback,useEffect } from 'react';
import Editor from './Editor';
import { useSocket } from '../../contexts/SocketContext';
import axios from 'axios';
import { useSelectedUserContext } from '../../contexts/SelectedUserContext'

const Java = () => {
    const [java, setJava] = useState(null);
    const socket = useSocket();
    const [selectedUserContext, setSelectedUserContext]=useSelectedUserContext();
    const outputRef = useRef(null);

    const fetchUserCodeChanges = useCallback((e) => {
        setJava(e.value);
    }, [socket])

    const runCode= async()=>{
        if(outputRef.current)
        {
            outputRef.current.value= 'Executing the code ...'
            const res = await axios.post('http://localhost:3000/execute',{code:java,language:'java',id:selectedUserContext});
            outputRef.current.value=res.output;
        }
       
    }
    useEffect(() => {
        if (socket) {
            socket.on('code_changes_acceped', fetchUserCodeChanges);
            return () => {
                socket.off('code_changes_acceped', fetchUserCodeChanges);
            }
        }

    }, [socket, fetchUserCodeChanges]);
    return (
        <div className="editor__code__container d-flex">
        <Editor language="text/x-java" displayName="Java" value={java} onchange={setJava} name='setJava'/>
            <div className="results__container" >
               <button className="btn btn-runCode" onClick={runCode}>Run Code</button>
               <div className="output__container" ref={outputRef}>

               </div>
            </div>
        </div>
    )
}
export default Java;