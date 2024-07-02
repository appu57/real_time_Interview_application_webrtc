import { useSocket } from '../contexts/SocketContext';
import { useContext, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
        console.log(formValues);
        if (socket) {
            socket.emit('join Room', { roomId: formValues['roomId'], password:formValues['password'] });
            navigation('/home');
        }
    }, [socket]);
    const handleFormValues = (e) => {
        setFormValues({ ...formValues, [e.target.name]: e.target.value });
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
        setFormValues({['roomId']:uniqueroomId,['password']:uniquePassword});
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
                                <input className="formField" {...field} onChange={handleFormValues} value={formValues[field.name]} />
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