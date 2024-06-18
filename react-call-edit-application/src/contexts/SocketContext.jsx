import React , {createContext, useContext} from 'react';
import {io} from 'socket.io-client'
const SocketContext = createContext();
export const useSocket = ()=>{
    const socket = useContext(SocketContext);
    return socket;

}

const SocketContextProvider = ({children})=>{
    const socket=io('http://localhost:3000',{transports:['websocket','polling','flashsocket']});
    return(
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}
export default SocketContextProvider;