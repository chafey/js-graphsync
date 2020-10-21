const createRequest = require('./request/create')
const createHandler = require('./handler')

const newGraphExchange = async (node, blockStoreGet, blockStorePut, logger, block) => {

    let nextRequestId = 0

    const requests = []

    const messageHandler = (peerId, message) => {
        //console.log('peerId=', peerId)
        message.responses.forEach((response) => {
            //console.log('response.id=',response.id)
            // look up request with this peerId and request Id
            requests.forEach((request) => {
                const info = request.proxy.info()
                //console.log(info)
                if(info.peerId.toB58String() === peerId && 
                   info.id == response.id) {
                       request.mutator.handleResponse(response, message.data)
                }
            })
        })
    }

    node.handle('/ipfs/graphsync/1.0.0', createHandler(messageHandler))

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