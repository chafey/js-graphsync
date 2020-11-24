const createRequest = require('./request/create')
const createStreamHandler = require('./stream-handler')
const createPeerMap = require('./peer-map')
const createMessageHandler = require('./message-handler')
const createRequestBlockResolver = require('./request-block-resolver')

const newGraphExchange = async (node, blockStore, logger, Block) => {

    const peerMap = createPeerMap()

    node.handle('/ipfs/graphsync/1.0.0', createStreamHandler(createMessageHandler(peerMap.getOrCreate)))

    const request = async (peerId, rootCID, selector) => {
        const peerIdAsString = peerId.toB58String()
        const peer = peerMap.getOrCreate(peerIdAsString)
        const requestId = peer.nextRequestId++

        const blockResolver = createRequestBlockResolver(blockStore, peer.blockBuffer)
 
        const {proxy, mutator, validator} = await createRequest(node, requestId, peerId, blockResolver.get, rootCID, selector)
        peer.requests[requestId] = {
            id: requestId,
            peerId,
            proxy,
            mutator,
            validator}
        return proxy
    }

    return {
        request
    }
}

module.exports = newGraphExchange