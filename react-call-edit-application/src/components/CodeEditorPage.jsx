import { LuMoveLeft } from "react-icons/lu";
import { GrRefresh } from "react-icons/gr";
import { useEffect } from "react";
import Codemirror from 'codemirror';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/css/css';
import 'codemirror/mode/xml/xml';
import 'codemirror/theme/dracula.css'
import WebEditor from './codeEditors/WebEditor'

const CodeEditorPage = () => {
    console.log()
    return (
        <div className="codeeditor__page__container">
            <WebEditor/>
            <div className="results__container">
                <header className="header__container">
                   <div className="domain__container">
                       <div className="icon__container">
                           <LuMoveLeft/>
                           <GrRefresh/>
                       </div>
                       <div className="domain__url">
                         <div className="url__container">
                             <p>http://localhost:3001</p>
                         </div>
                       </div>
                       <div className="right__icon__container">

                       </div>
                   </div>
                </header>
                <div className="iframe__container">
                    <iframe sandbox="allow-scripts" title="output" frameBorder="0" width="100%" height="100%"></iframe>
                </div>
            </div>

        </div>
    )
}
export default CodeEditorPage;