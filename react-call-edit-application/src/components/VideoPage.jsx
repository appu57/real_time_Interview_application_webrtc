import React from 'react';
import { useSocket } from '../contexts/SocketContext';
import { useContext, useEffect, useState, useCallback } from 'react';
import ReactPlayer from 'react-player';
import PeerService from '../services/PeerService';
import { useSelectedUserContext } from '../contexts/SelectedUserContext'

import { AiOutlineAudioMuted } from "react-icons/ai";
import { FaVideoSlash } from "react-icons/fa";
import { useNavigate, useParams } from 'react-router-dom';

import { FaVideo } from "react-icons/fa";
import { FaMicrophoneAlt } from "react-icons/fa";
const VideoPage = () => {
    const socket = useSocket();
    const [remoteSocket, setRemoteSocket] = useState(null);
    const [remoteStreams, setRemoteStreams] = useState(null);
    const [streams, setStreams] = useState(null);
    const [selectedUserContext, setSelectedUserContext] = useSelectedUserContext();
    const [videoEnabled, setVideoState] = useState(true);
    const [audioEnabled, setAudioState] = useState(true);
    const [leaveMeeting, setLeaveMeeting] = useState(false);
    const navigation = useNavigate();
    const [callUserMedia, setCallUserMedia] = useState(true);
    const {roomId} = useParams();
    const joinRoom = (e) => {
        console.log('join',e);
        sendOffer(e.userId);
    }
    const showUserMedia = async () => {
        if (PeerService.peer.signalingState=='closed') {
            PeerService.createConnection();
        }
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        setStreams(stream);
    };

    const sendOffer = useCallback(async (to) => {
        setRemoteSocket(to);
        setSelectedUserContext(to)
        const offer = await PeerService.getOffer();
        console.log(offer)
        socket.emit('send_offer', { to: to, offer: offer });
    }, [socket, streams]);

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
        console.log(e);
        setSelectedUserContext(e.from);
        setRemoteSocket(e.from);//set remote socket id which is created in backend
        const streams = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        setStreams(streams);
        const answer = await PeerService.getAnswer(e.offer);
        socket.emit('send_answer', { to: e.from, answer: answer });
    }, [socket,streams]);

    const receiveAnswer = useCallback(async (e) => {
        console.log('answer',e);
        await PeerService.setRemoteDescription(e.answer);
        await sendStreams();
    }, [sendStreams]);

    const negotiationNeeded = useCallback(async (e) => {
        const { from, offer } = e;
        console.log(offer);
        const answer = await PeerService.getAnswer(offer);
        socket.emit('negotiation_completed', { to: from, answer: answer });
        sendStreams();
    }, [socket, sendStreams]);

    const negotiationCompleted = useCallback(async (e) => {
        await PeerService.setRemoteDescription(e.answer);
    }, [socket]);

    const handleNegotiation = useCallback(async (e) => {
        const offer = await PeerService.getOffer();
        socket.emit('negotiation', { to: remoteSocket, offer: offer });
    }, [remoteSocket, socket])
    const LeaveMeeting = () => {
        socket.emit('leave',{roomId:roomId,to:selectedUserContext})
        PeerService.stopSendingTrack();
        PeerService.peer.close();
        setLeaveMeeting(true);
        setStreams(null);
        setRemoteStreams(null);
        setCallUserMedia(true);
        navigation('/');

    }

    const onMute = () => {
        streams.getTracks().forEach(track => {
            if (track.kind == 'audio') {
                track.enabled = !track.enabled;
                setAudioState(track.enabled);
            }
        });
    };
    const onVideoDisable = (e) => {
        streams.getTracks().forEach(track => {
            if (track.kind == 'video') {
                track.enabled = !track.enabled;
                setVideoState(track.enabled);
            }
        });
    }
    
    const addTrack=(e)=>{
        const remoteStream = e.streams;
        setRemoteStreams(remoteStream[0]);
        console.log('remote stream',remoteStream);
    }

    const closeRemoteSocket=(e)=>{
        setRemoteStreams(null);
        PeerService.stopSendingTrack();
    }

    useEffect(() => {
        if(PeerService.peer)
        {
        PeerService.peer.addEventListener('track',addTrack)
        }
    }, [addTrack])

    useEffect(() => {
        if(PeerService.peer)
        {
        PeerService.peer.addEventListener('negotiationneeded', handleNegotiation);
        return () => {
            PeerService.peer.removeEventListener('negotiationneeded', handleNegotiation);
        }}
    }, [handleNegotiation])
    useEffect(() => {
        if (socket) {
            if (!leaveMeeting && callUserMedia) {
                showUserMedia();
                setCallUserMedia(false);

            }
            socket.on('user_joined', joinRoom);
            socket.on('receive_offer', receiveOffer);
            socket.on('receive_answer', receiveAnswer);
            socket.on('negotiation', negotiationNeeded);
            socket.on('negotiation_completed', negotiationCompleted);
            socket.on('leave meeting',closeRemoteSocket)
            return () => {
                socket.off('user_joined', joinRoom);
                socket.off('receive_offer', receiveOffer);
                socket.off('receive_answer', receiveAnswer);
                socket.off('negotiation', negotiationNeeded);
                socket.off('negotiation_completed', negotiationCompleted);
                socket.off('leave meeting',closeRemoteSocket)

            }
        }
    }, [socket, joinRoom, receiveAnswer, negotiationNeeded, negotiationCompleted, receiveOffer, showUserMedia,closeRemoteSocket,callUserMedia,leaveMeeting])
    return (
        <div className="video__page__container">
            <div className="stream__container" style={{ height: "45%" }}>
                {
                    streams &&
                    (<ReactPlayer playing className="stream" height="100%" width="100%" url={streams} />)
                }

            </div>

            <div className="remoteStream__container " style={{ height: "45%" }}>

                {
                    remoteStreams && (<ReactPlayer playing className="rstream" height="100%" width="100%" url={remoteStreams} />)
                    // :(<img src={CameraDisabled} alt="Camera disabled" width="50%" height="400px"/>)
                }

            </div>
            <div className="button__container">
                <div className="video__button__container">
                    <div className="button button--mute" onClick={onMute}>{!audioEnabled ? (<AiOutlineAudioMuted />) : (<FaMicrophoneAlt />)}</div>
                    <div className="button button--video" onClick={onVideoDisable}>{!videoEnabled ? (<FaVideoSlash />) : (<FaVideo />)}</div>
                </div>
                <button className="btn btn_leave_meeting" onClick={LeaveMeeting}>Leave Meeting</button>
            </div>
        </div>
    )
}
export default VideoPage;