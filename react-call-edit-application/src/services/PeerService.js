class PeerService {
    constructor() {
        if (!this.peer) {
          this.createConnection();
        }
    }

    async getOffer(){
        if(this.peer)
        {
         const offer = await this.peer.createOffer();//once we create an offer we have to set local description of the offer created once when peer sends the answer we can set remotedescription
        console.log(offer);
         await this.peer.setLocalDescription(new RTCSessionDescription(offer));
         return offer;
        }
    }

    async getAnswer(offer){
        if(this.peer)
        {
            //since during an answer event we have both local and remote session description we can set it.
            await this.peer.setRemoteDescription(offer)
            const answer= await this.peer.createAnswer();
            await this.peer.setLocalDescription(new RTCSessionDescription(answer));
            return answer;
        }
    }

    async setRemoteDescription(answer)
    {
        if(this.peer)
        {
          await this.peer.setRemoteDescription(new RTCSessionDescription(answer));
        }
    }

     createConnection(){
        this.peer = new RTCPeerConnection({
            iceServers: [
                {
                    urls: [
                        "stun:stun.services.mozilla.com",
                        "stun:stun1.1.google.com:19302"
                    ]
                }
            ]
        })
        console.log(this.peer)
    }

    stopSendingTrack(){
        if(this.peer)
        {
            this.peer.getSenders().forEach(sender=>this.peer.removeTrack(sender));
        }
    }
}
export default new PeerService();