const createBlockDataMessageHandler = require('./message-handlers/block-data')
const createResponseMessageHandler = require('./message-handlers/response')
const createDebugMessageHandler = require('./message-handlers/debug')
/**
 * Creates a message handler to use when handling graphsync messages
 * @param {*} getOrCreatePeer 
 * @param {*} Block 
 */

const createMessageHandler = (getOrCreatePeer, Block) => {

    const debugMessageHandler = createDebugMessageHandler()

    const blockDataMessageHandler = createBlockDataMessageHandler((peerIdAsString) => {
        return getOrCreatePeer(peerIdAsString).blockBuffer
    }, Block)

    const responseMessageHandler = createResponseMessageHandler((peerIdAsString, requestId) => {
        const peer = getOrCreatePeer(peerIdAsString)
        return peer.requests[requestId].mutator
    })


    return async (peerIdAsString, message) => {
        await debugMessageHandler(peerIdAsString, message)
        await blockDataMessageHandler(peerIdAsString, message)
        await responseMessageHandler(peerIdAsString, message)
    }
}


module.exports = createMessageHandler