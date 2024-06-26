import React from 'react';
import { useSocket } from '../contexts/SocketContext';
import { useContext, useEffect, useState, useCallback } from 'react';
import ReactPlayer from 'react-player';
import PeerService from '../services/PeerService';
import { useSelectedUserContext } from '../contexts/SelectedUserContext'

const VideoPage = () => {
    const socket = useSocket();
    const [remoteSocket, setRemoteSocket] = useState(null);
    const [remoteStreams, setRemoteStreams] = useState(null);
    const [streams, setStreams] = useState(null);
    const [selectedUserContext, setSelectedUserContext]=useSelectedUserContext();

    const joinRoom = (e) => {
        console.log(e);
        sendOffer(e.userId);
    }
    const showUserMedia = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        setStreams(stream);
    }, [socket,streams]);

    const sendOffer =useCallback (async(to) => {
        setRemoteSocket(to);
        setSelectedUserContext(to) 
        const offer = await PeerService.getOffer();
        socket.emit('send_offer', { to: to, offer: offer });
    },[socket,streams]);

    const sendStreams = useCallback(async () => {
        if (streams) {
            try {
                for (const track of streams.getTracks()) {
                    PeerService.peer.addTrack(track, streams);
                }
            }
            catch (e) {
                console.log(e);
            }
        }

    }, [streams]);
    const receiveOffer = useCallback(async (e) => {
        setSelectedUserContext(e.from);        
        setRemoteSocket(e.from);//set remote socket id which is created in backend
        
        const streams = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        setStreams(streams);
        const answer = await PeerService.getAnswer(e.offer);
        socket.emit('send_answer', { to: e.from, answer: answer });
    }, [socket]);

    const receiveAnswer = useCallback(async (e) => {
        console.log(e);
        await PeerService.setRemoteDescription(e.answer);
        await sendStreams();
    }, [sendStreams,socket]);

    const negotiationNeeded = useCallback(async (e) => {
        const { from, offer } = e;
        console.log(offer);
        const answer = await PeerService.getAnswer(offer);
        socket.emit('negotiation_completed', { to: from, answer:answer });
        sendStreams();
    }, [socket, sendStreams]);

    const negotiationCompleted = useCallback(async (e) => {
        await PeerService.setRemoteDescription(e.answer);
    }, [socket]);

    const handleNegotiation = useCallback(async (e) => {
        const offer = await PeerService.getOffer();
        socket.emit('negotiation', { to: remoteSocket, offer: offer });
    }, [remoteSocket, socket])
    const leaveMeeting=()=>{

    }
    useEffect(() => {
        PeerService.peer.addEventListener('track', async (e) => {
            const remoteStream = e.streams;
            setRemoteStreams(remoteStream[0]);
            console.log(remoteStream);
        })
    }, [])

    useEffect(() => {
        PeerService.peer.addEventListener('negotiationneeded', handleNegotiation);
        return () => {
            PeerService.peer.removeEventListener('negotiationneeded', handleNegotiation);
        }
    }, [handleNegotiation])
    useEffect(() => {
        if (socket) {
            showUserMedia();
            socket.on('user_joined', joinRoom);
            socket.on('receive_offer', receiveOffer);
            socket.on('receive_answer', receiveAnswer);
            socket.on('negotiation', negotiationNeeded);
            socket.on('negotiation_completed', negotiationCompleted);
            return () => {
                socket.off('user_joined', joinRoom);
                socket.off('receive_offer', receiveOffer);
                socket.off('receive_answer', receiveAnswer);
                socket.off('negotiation', negotiationNeeded);
                socket.off('negotiation_completed', negotiationCompleted);
            }
        }
    }, [socket, joinRoom, receiveAnswer, negotiationNeeded, negotiationCompleted, receiveOffer,showUserMedia])
    return (
        <div className="video__page__container">
            <div className="stream__container" style={{height:"45%"}}>
                {
                    streams &&
                        (<ReactPlayer playing className="stream" height="100%" width="100%"  url={streams} />)
                }
            </div>

            <div className="remoteStream__container " style={{height:"45%"}}>

                {
                    remoteStreams && (<ReactPlayer playing className="rstream" height="100%" width="100%" url={remoteStreams} />)
                    // :(<img src={CameraDisabled} alt="Camera disabled" width="50%" height="400px"/>)

                }

            </div>
            <div className="button__container">
                <button className="btn btn_leave_meeting" onClick={leaveMeeting}>Leave Meeting</button>
            </div>
        </div>
    )
}
export default VideoPage;