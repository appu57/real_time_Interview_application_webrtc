import { useSocket } from '../contexts/SocketContext';
import { useContext, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PeerService from '../services/PeerService';

const LoginPage = () => {
    const navigation = useNavigate();
    const socket = useSocket();
    const [fields, setFields] = useState([
        {
            name: 'roomId',
            placeholder: 'Enter the Room Id',
            type: 'text'
        },
        {
            name: 'password',
            placeholder: 'Enter the passcode',
            type: 'text'
        }
    ])
    const [formValues, setFormValues] = useState({
        roomId: '',
        password: ''
    })
    const handleUserJoin = useCallback((e) => {
        if (socket) {
            const roomId='1';
            socket.emit('join Room', { roomId: roomId, password:formValues['password'] });
            navigation(`/home/1`);
        }
    }, [socket]);
    const handleFormValues = (e) => {
        console.log(e.target);
        setFormValues({ ...formValues, [e.target.name]: e.target.value });
        console.log(formValues);
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
       
        setFormValues({...formValues,['roomId']:uniqueroomId,['password']:uniquePassword});
        console.log(formValues);

    }
    return (
        <div className="login__page__container">
            <div className="home_page_container">

        
            <div className="form__container">
                <h2>PracticeMate.io</h2>

                <form>
                    {
                        fields.map((field, index) => (
                            <div className="roomId__input__container" key={index}>
                                <input className="formField" {...field} onChange={handleFormValues}  />
                            </div>
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