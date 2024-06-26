import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client'
const SocketContext = createContext();
export const useSocket = () => {
    const socket = useContext(SocketContext);
    return socket;

}

const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    useEffect(() => {
            const socketConn = io('http://localhost:3000', {timeout:1000,reconnectionAttempts:'Infinity' ,transports: ['websocket', 'polling', 'flashsocket'] });
            setSocket(socketConn);
            return () => {
                socketConn.close();
                console.log('Socket connection is closed');
            }
        
    }, [])
    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}
export default SocketContextProvider;