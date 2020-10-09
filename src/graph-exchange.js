const createRequest = require('./request')
const graphsyncMessage = require('./message/graphsync-message')
const dagCBOR = require('ipld-dag-cbor')
const lp = require('it-length-prefixed')
const { pipe } = require('it-pipe')
const createPeerManager = require('./peer-manager')
const createHandler = require('./handler')

const newGraphExchange = async (node, blockStoreGet, blockStorePut, logger, block) => {
    const peerManager = createPeerManager(node)

    createHandler(node, peerManager)

    return {
        request: async (responderPeerId, rootCID, selector) => {
            const peer = await peerManager.getOrCreatePeer(responderPeerId)
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

            return await createRequest(responderPeerId, rootCID, selector)
        }
    }
}

module.exports = newGraphExchange