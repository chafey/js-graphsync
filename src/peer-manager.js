const createPeerManager = (node) => {

    const peerIdMap = {}

    return {
        getOrCreatePeer : async(peerId) => {
            const peer = peerIdMap[peerId]
            if(peer) {
                return peer
            }

            // TODO: Prevent race condition here

            // immediately dial the peer so we can send messages back to it
            const { stream } = await node.dialProtocol(peerId, '/ipfs/graphsync/1.0.0')

            const newPeer = {
                nextRequestId : 0,
                outgoingStream: stream,
                inboundStreams: [],
                requests: []
            }
    
            peerIdMap[peerId] = newPeer

            return newPeer
        }
    }
}

module.exports = createPeerManager