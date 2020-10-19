// PeerManager:
//  * manages

const createPeerManager = (node) => {

    const peerIdMap = {}

    return {
        getOrCreatePeer : async(peerId) => {
            const peer = peerIdMap[peerId]
            if(peer) {
                await peer.dialPromise
                return peer
            }

            const newPeer = {
                nextRequestId : 0,
                dialPromise : node.dialProtocol(peerId, '/ipfs/graphsync/1.0.0'),
                outgoingStream: undefined,
                inboundStreams: [],
                requests: []
            }
    
            peerIdMap[peerId] = newPeer

            newPeer.outgoingStream = (await newPeer.dialPromise).stream

            return newPeer
        }
    }
}

module.exports = createPeerManager