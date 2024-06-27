import { LuMoveLeft } from "react-icons/lu";
import { GrRefresh } from "react-icons/gr";
import { useEffect } from "react";
import Codemirror from 'codemirror';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/css/css';
import 'codemirror/mode/xml/xml';
import 'codemirror/theme/dracula.css'
import WebEditor from './codeEditors/WebEditor';
import { useRef, useState } from 'react';
import Java from './codeEditors/Java';
import Javascript from './codeEditors/Javascript';
import CcodeEditor from './codeEditors/CcodeEditor';


import { useSocket } from '../contexts/SocketContext'
import { useSelectedUserContext } from '../contexts/SelectedUserContext'


const CodeEditorPage = () => {
    const socket = useSocket();
    const [selectedUserContext, setSelectedUserContext]=useSelectedUserContext();
    const userOptionSelect=useRef(null);
    const [language, setLanguage] = useState('webdev');
    const onlanguagechange = (e) => {
      setLanguage(e.target.value);
      socket.emit('playground__change',{to:selectedUserContext,playground:e.target.value})
    }
    const setChangedLanguage=(e)=>{
        if(userOptionSelect.current!=null)
        {
            console.log(userOptionSelect.current)
            userOptionSelect.current.value=e.playground;
        }
        setLanguage(e.playground);
    }
    useEffect(()=>{
       if(socket)
       {
           socket.on('playground__change',setChangedLanguage);
           return ()=>{
               socket.off('playground__change',setChangedLanguage);
           }
       }
    },[socket,setChangedLanguage])
    return (
        <div className="language__container">
            <div className="dropdown__option__container">
                <label>Select Playground : </label>
                <select name="language" id="langauges" onChange={onlanguagechange}  ref={userOptionSelect}>
                <option value="webdev">Web Developement</option>
                    <option value="java">Java</option>
                    <option value="javascript">Javascript</option>
                    <option value="C++">C++</option>
                </select>

            </div>
            {
                language=="javascript" && <Javascript/>
            }
            {
                language == "java" && <Java />
            }
            {
                language=='webdev' && <WebEditor />
            }
            {
                language=='C++' && <CcodeEditor/>
            }


        </div>
    )
}
export default CodeEditorPage;