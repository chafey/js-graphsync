const createRequest = require('./request/create')
const createStreamHandler = require('./stream-handler')
const createResponseHandler = require('./response/handler')

const newGraphExchange = async (node, blockStore, logger, Block) => {

    let nextRequestId = 0

    const requests = []

    const responseHandler = createResponseHandler(Block, blockStore)

    const messageHandler = async (peerId, message) => {
        //console.log('peerId=', peerId)
        for(const response of message.responses) {
            // look up request with this peerId and request Id
            for(const request of requests) {
                const info = request.proxy.info()
                //console.log(info)
                if(info.peerId.toB58String() === peerId && 
                   info.id == response.id) {
                    await responseHandler(request.proxy, request.mutator, response, message.data)
                }
            }
        }
    }

    node.handle('/ipfs/graphsync/1.0.0', createStreamHandler(messageHandler))

    const request = async (peerId, rootCID, selector) => {
        const requestId = nextRequestId++
        const {proxy, mutator} = await createRequest(node, requestId, peerId, rootCID, selector)
        requests.push({
            id: requestId,
            peerId,
            proxy,
            mutator})
        return proxy
    }

    return {
        request
    }
}

module.exports = newGraphExchange