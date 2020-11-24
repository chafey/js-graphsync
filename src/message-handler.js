const createBlockDataMessageHandler = require('./message-handlers/block-data')
const createResponseMessageHandler = require('./message-handlers/response')
const Block = require('@ipld/block/defaults')

const createMessageHandler = (getOrCreatePeer) => {

    const blockDataMessageHandler = createBlockDataMessageHandler((peerIdAsString) => {
        return getOrCreatePeer(peerIdAsString).blockBuffer
    }, Block)

    const responseMessageHandler = createResponseMessageHandler((peerIdAsString, requestId) => {
        const peer = getOrCreatePeer(peerIdAsString)
        return peer.requests[requestId].mutator
    })

    return async (peerIdAsString, message) => {
        await blockDataMessageHandler(peerIdAsString, message)
        await responseMessageHandler(peerIdAsString, message)
    }
}


module.exports = createMessageHandler