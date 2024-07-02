import React, { useState, useRef ,useCallback,useEffect } from 'react';
import Editor from './Editor';
import { useSocket } from '../../contexts/SocketContext';
import axios from 'axios';
import { useSelectedUserContext } from '../../contexts/SelectedUserContext'

const Javascript = () => {
    const [Javascript, setJavascript] = useState(null);
    const socket = useSocket();
    const [selectedUserContext, setSelectedUserContext]=useSelectedUserContext();
    const outputRef = useRef(null);

    const fetchUserCodeChanges = useCallback((e) => {
        setJavascript(e.value);
    }, [socket])

    const runCode= async()=>{
        socket.emit('compiling code',{to:selectedUserContext})
        if(outputRef.current)
        {
            outputRef.current.innerHTML= 'Executing the code ...';
            const res = await axios.post('http://localhost:3000/execute',{code:Javascript,language:'javascript',id:selectedUserContext});
            if(res.data.output)
            {
            outputRef.current.innerHTML=res.data.output;
            socket.emit('runcode',{to:selectedUserContext,value:res.data.output});

            }else{
                outputRef.current.innerHTML=res.data.error;
            }
        }
       
    }
    const fetchProgramState=(e)=>{
        if(outputRef.current)
        {
            outputRef.current.innerHTML= 'Executing the code ...';
        }   
    }
    const fetchRunFromPeer= async(e)=>{
        console.log(e);
        if(outputRef.current)
        {
            outputRef.current.innerHTML=`<pre>${e.value}</pre>`;
        }
    }
    useEffect(() => {
        if (socket) {
            socket.on('code_changes_acceped', fetchUserCodeChanges);
            socket.on('run code',fetchRunFromPeer);
            socket.on('compile code',fetchProgramState)

            return () => {
                socket.off('code_changes_acceped', fetchUserCodeChanges);
                socket.off('run code',fetchRunFromPeer);
                socket.off('compile code',fetchProgramState)


            }
        }

    }, [socket, fetchUserCodeChanges,fetchRunFromPeer,fetchProgramState]);
    return (
        <div className="editor__code__container d-flex">
        <Editor language="javascript" displayName="Javascript" value={Javascript} onchange={setJavascript} name='setJavascript'/>
            <div className="results__container" >
               <button className="btn btn-runCode" onClick={runCode}>Run Code</button>
               <div className="output__container" ref={outputRef}>

               </div>
            </div>
        </div>
    )
}
export default Javascript;