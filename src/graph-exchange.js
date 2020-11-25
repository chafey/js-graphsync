const createStreamHandler = require('./stream-handler')
const createPeerMap = require('./peer-map')
const createMessageHandler = require('./message-handler')
const createRequestBuilder = require('./request-builder')

const newGraphExchange = async (node, blockStore, logger, Block) => {

    const peerMap = createPeerMap()

    node.handle('/ipfs/graphsync/1.0.0', createStreamHandler(createMessageHandler(peerMap.getOrCreate, Block)))

    const requestBuilder = createRequestBuilder(node, blockStore, peerMap.getOrCreate)

    return {
        request : requestBuilder
    }
}

module.exports = newGraphExchange