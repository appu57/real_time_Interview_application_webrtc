import React, { useRef } from 'react';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/css/css';
import 'codemirror/mode/clike/clike'
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/clike/clike';

import 'codemirror/theme/dracula.css';
import { useEffect } from "react";
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/lint/lint';
import 'codemirror/addon/lint/lint.css';
import 'codemirror/mode/python/python';
import 'codemirror/addon/lint/javascript-lint';
import { Controlled as ControlledEditor } from 'react-codemirror2';
import { useSocket } from '../../contexts/SocketContext'
import { useSelectedUserContext } from '../../contexts/SelectedUserContext'


const Editor = ({ language, displayName, value, onchange ,name }) => {

    const [selectedUserContext, setSelectedUserContext]=useSelectedUserContext();
    const socket = useSocket();
    const onValueChange = (editor, data, value) => {
        if(socket)
        {
        socket.emit('code_changes',{language:language,value:value,cb:name,to:selectedUserContext})
        }
        onchange(value);
    }
    return (
        <div className={`editor__page ${displayName}` }>
            <div className="editor__title">
                <p>{displayName}</p>
            </div>
            <ControlledEditor 
                onBeforeChange={onValueChange}
                value={value}
                className="code-mirror-wrapper"
                options={{
                    lineNumbers: true,
                    mode: language,
                    lineWrapping: true,
                    theme: 'dracula',
                    lint:true,
                    gutters:['CodeMirror-lint-markers']

                }}

            />
        </div>
    )
}

export default Editor;