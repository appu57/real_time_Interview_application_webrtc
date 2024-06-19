import React from 'react';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/css/css';
import 'codemirror/mode/xml/xml';
import 'codemirror/theme/dracula.css';
import { useEffect } from "react";
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/lib/codemirror.css';
import { Controlled as ControlledEditor } from 'react-codemirror2'

const Editor = ({ language, displayName, value, onchange }) => {
    const onValueChange = (editor,data,value) => {
        onchange(value);
    }
    return (
        <div className="editor__page">
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
                    theme:'dracula',
                }}
              
            />
        </div>
    )
}

export default Editor;