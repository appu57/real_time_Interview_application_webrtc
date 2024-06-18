import { useSocket } from '../contexts/SocketContext';
import { useContext, useEffect, useState, useCallback } from 'react';
const LoginPage = () =>{
    const navigation = useNa
    const socket = useSocket();
    const handleUserJoin=(e)=>{
      if(socket)
      {
          socket.emit('join Room',{roomId:"1"});
      }
    }
    return (
        <div className="login__page__container">
            <h1 onClick={handleUserJoin}>Login</h1>
        </div>
    )
}
export default LoginPage;