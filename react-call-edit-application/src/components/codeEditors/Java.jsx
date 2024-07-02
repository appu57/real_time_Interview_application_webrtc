import React, { useState, useRef ,useCallback,useEffect } from 'react';
import Editor from './Editor';
import { useSocket } from '../../contexts/SocketContext';
import axios from 'axios';
import { useSelectedUserContext } from '../../contexts/SelectedUserContext'

const Java = () => {
    const [java, setJava] = useState(`class Java
{
    public static void main(String[]args)
    {
        System.out.println("Welcome to PracticeMate.io");
    }
}`);
    const socket = useSocket();
    const [selectedUserContext, setSelectedUserContext]=useSelectedUserContext();
    const outputRef = useRef(null);

    const fetchUserCodeChanges = useCallback((e) => {
        setJava(e.value);
    }, [socket])

    const runCode= async()=>{
        socket.emit('compiling code',{to:selectedUserContext})
        if(outputRef.current)
        {
            outputRef.current.innerHTML= 'Executing the code ...';
            const res = await axios.post('http://localhost:3000/execute',{code:java,language:'java',id:selectedUserContext});
            outputRef.current.innerHTML=`<pre>${res.data.output}</pre>`;
            socket.emit('runcode',{to:selectedUserContext,value:res.data.output});
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