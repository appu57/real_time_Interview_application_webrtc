import React from 'react';
import { useSocket } from '../contexts/SocketContext';
import { useContext, useEffect, useState, useCallback } from 'react';
import ReactPlayer from 'react-player';
import PeerService from '../services/PeerService';
const VideoPage = () =>{
    const socket = useSocket();
    const joinRoom=(e)=>{

    }
    const sendOffer=(e)=>{

    }
    const receiveAnswer=(e)=>{

    }
    const negotiationNeeded=(e)=>{

    }
    const negotiationCompleted=(e)=>{
        
    }
    useEffect(()=>{
        if(socket)
        {
          socket.on('join_room',joinRoom);
          socket.on('send offer',sendOffer);
          socket.on('receive answer',receiveAnswer);
          socket.on('negotiation',negotiationNeeded);
          socket.on('negotation completed',negotiationCompleted);
          return ()=>{
            socket.off('join_room',joinRoom);
            socket.off('send offer',sendOffer);
            socket.off('receive answer',receiveAnswer);
            socket.off('negotiation',negotiationNeeded);
            socket.off('negotation completed',negotiationCompleted);  
          }
        }
    },[socket,joinRoom,sendOffer,receiveAnswer,negotiationNeeded,negotiationCompleted])
    return (
        <div className="video__page__container">
            <div className="stream__container">

            </div>
            <div className="remoteStream__container">

            </div>
        </div>
    )
}
export default VideoPage;