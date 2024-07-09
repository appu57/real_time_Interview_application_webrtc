import { useSocket } from '../contexts/SocketContext';
import { useContext, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PeerService from '../services/PeerService';

const LoginPage = () => {
    const navigation = useNavigate();
    const socket = useSocket();
    const [fields, setFields] = useState([
        {
            name: "roomId",
            placeholder: "Enter the Room Id",
            type: "text"
        },
        {
            name: "password",
            placeholder: "Enter the passcode",
            type: "text"
        }
    ])
    const [formValues, setFormValues] = useState({
        roomId: '',
        password: ''
    })
    const handleUserJoin = useCallback((e) => {
        if (socket) {
            if(formValues.roomId && formValues.password)
            {
            // navigation(`/home/${formValues.roomId}`);
             socket.emit('join Room', { roomId: formValues.roomId, password:formValues.password });
            }
        }
    }, [socket,formValues]);

    const handleFormValues = (e) => {
        e.preventDefault();
        setFormValues(prev=>({
            ...prev,
            [e.target.name]:e.target.value
        }));
    }
    const handleRandomRoomIdGeneration = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ-';
        let uniqueroomId = '';let uniquePassword='';
        for (let i = 0; i < 12; i++) {
            const roomIdrandom = Math.floor(Math.random() * characters.length);
            const passwordRandom = Math.floor(Math.random() * characters.length);
            uniqueroomId += characters[roomIdrandom];
            uniquePassword+=characters[passwordRandom];
        }
        console.log(uniqueroomId);
        setFormValues({roomId:uniqueroomId,password:uniquePassword});
        console.log(formValues);

    }
    const showInvalidMessage=(e)=>{
      console.log(e.message);
    }
    const navigateToHome=(e)=>{
        navigation(`/home/${formValues.roomId}`);
    }
    useEffect(()=>{
        if(socket)
        {
          socket.on('invalid password',showInvalidMessage);
          socket.on('valid password',navigateToHome);
          return ()=>{
            socket.off('invalid password',showInvalidMessage);
            socket.off('valid password',navigateToHome);

          }
        }
    },[socket,showInvalidMessage,navigateToHome])
    return (
        <div className="login__page__container">
            <div className="home_page_container">

        
            <div className="form__container">
                <h2>PracticeMate.io</h2>

                <form>
                    {
                        fields.map((field, index) => (
                            <input className="formField" {...field} onChange={handleFormValues} key={index} value={formValues[field.name]}/>
                        ))
                    }

                </form>
                <div className="button__container">
                    <button className="btn" onClick={handleUserJoin}>Login</button>
                    <button className="btn" onClick={handleRandomRoomIdGeneration}>Generate</button>
                </div>

            </div>
            </div>
        </div>
    )
}
export default LoginPage;