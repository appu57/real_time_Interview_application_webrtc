import { useSocket } from '../contexts/SocketContext';
import { useContext, useEffect, useState, useCallback } from 'react';
import {useNavigate} from 'react-router-dom';
const LoginPage = () =>{
    const navigation = useNavigate();
    const socket = useSocket();
    const handleUserJoin=useCallback((e)=>{
        console.log(e);
      if(socket)
      {
          socket.emit('join Room',{roomId:"1"});
          navigation('/home');
      }
    },[socket]);
    return (
        <div className="login__page__container">
            <h1 onClick={handleUserJoin}>Login</h1>
        </div>
    )
}
export default LoginPage;