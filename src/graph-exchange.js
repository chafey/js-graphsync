const createRequest = require('./request')
const graphsyncMessage = require('./message/graphsync-message')
const dagCBOR = require('ipld-dag-cbor')
const lp = require('it-length-prefixed')
const { pipe } = require('it-pipe')

const newGraphExchange = async (node, blockStoreGet, blockStorePut, logger, block) => {
    const self = this

    const newStreamHandler = async({connection, stream, protocol}) => {
        //console.log("newStreamHandler for", protocol)
    }

    node.handle('/ipfs/graphsync/1.0.0', newStreamHandler)

    const peers = {}

    const getOrCreatePeer = async (peerId) => {
        const peer = peers[peerId]
        if(peer) {
            return peer
        }
        
        const { stream } = await node.dialProtocol(peerId, '/ipfs/graphsync/1.0.0')

        const newPeer = {
            nextRequestId : 0,
            outgoingStream: stream
        }

        peers[peerId] = newPeer
        return newPeer
    }


    return {
        request: async (responderPeerId, rootCID, selector) => {
            const peer = await getOrCreatePeer(responderPeerId)
            const requestId = peer.nextRequestId++

            const bytes = graphsyncMessage.Message.encode({
                completeRequestList: true,
                requests: [
                    {
                        id: requestId,
                        root: rootCID.bytes,
                        selector: dagCBOR.util.serialize(selector),
                        priority: 0,
                        cancel: false,
                        update: false,
                    }
                ]
            })

            await pipe([bytes],
                lp.encode(),
                peer.outgoingStream)

            return await createRequest(self, responderPeerId, rootCID, selector)
        }
    }
}

module.exports = newGraphExchange