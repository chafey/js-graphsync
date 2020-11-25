const createRequestBlockResolver = require('./request-block-resolver')
const createRequest = require('./request/create')
const createRequestValidator = require('./request/validator')

const createRequestBuilder = (node, blockStore, getOrCreate) => {
    return async (peerId, rootCID, selector) => {
        const peerIdAsString = peerId.toB58String()
        const peer = getOrCreate(peerIdAsString)
        const requestId = peer.nextRequestId++

        const blockResolver = createRequestBlockResolver(blockStore, peer.blockBuffer)
 
        const validator = createRequestValidator(rootCID, selector, blockResolver.get)

        const {proxy, mutator} = await createRequest(node, requestId, peerId, validator, rootCID, selector)
        peer.requests[requestId] = {
            id: requestId,
            peerId,
            proxy,
            mutator,
            validator}
        return proxy
    }
}

module.exports = createRequestBuilder