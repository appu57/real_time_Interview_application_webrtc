import React, { useState, useRef ,useCallback,useEffect } from 'react';
import Editor from './Editor';
import { useSocket } from '../../contexts/SocketContext';
import axios from 'axios';
import { useSelectedUserContext } from '../../contexts/SelectedUserContext'

const CcodeEditor = () => {
    const [Ccode, setCcode] = useState(null);
    const socket = useSocket();
    const [selectedUserContext, setSelectedUserContext]=useSelectedUserContext();
    const outputRef = useRef(null);

    const fetchUserCodeChanges = useCallback((e) => {
        setCcode(e.value);
    }, [socket])

    const runCode= async()=>{
        if(outputRef.current)
        {
            console.log(outputRef);
            outputRef.current.innerHTML= 'Executing the code ...';
            const res = await axios.post('http://localhost:3000/execute',{code:Ccode,language:'cpp',id:selectedUserContext});
            outputRef.current.innerHTML=res.data.output;
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
        <Editor language="text/x-c++src" displayName="CPP" value={Ccode} onchange={setCcode} name='setCcode'/>
            <div className="results__container" >
               <button className="btn btn-runCode" onClick={runCode}>Run Code</button>
               <div className="output__container" ref={outputRef}>

               </div>
            </div>
        </div>
    )
}
export default CcodeEditor;