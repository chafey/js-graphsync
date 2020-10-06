const graphsyncMessage = require('../../src/message/graphsync-message')
const dagCBOR = require('ipld-dag-cbor')
const lp = require('it-length-prefixed')
const { pipe } = require('it-pipe')

const create = async (node, peerId) => {
    let nextRequestId = 0
    
    const requests = []

    //console.log('peer =', peer)

    const { stream } = await node.dialProtocol(peerId, '/ipfs/graphsync/1.0.0')

    console.log('Dialer dialed to listener on protocol: /ipfs/graphsync/1.0.0')

    return {
        sendRequest: (root, selector) => {
            // generate a unique requestId for this request
            const requestId = nextRequestId++

            // store the request parameters so we can find them later when receiving responses
            requests[requestId] = {root, selector}
            console.log('requests=',requests)
            // encode the request as a graphsync message 
            const bytes = graphsyncMessage.Message.encode({
                completeRequestList: true,
                requests: [
                    {
                        id: requestId,
                        root: root.bytes,
                        selector: dagCBOR.util.serialize(selector),
                        priority: 0,
                        cancel: false,
                        update: false,
                    }
                ]
            })
            console.log('sending request message of length', bytes.length)

            // send the message bytes to the requester
            pipe([bytes],
                lp.encode(),
                stream)
        },
        sendResponse: (requestId, blocks) => {
            // encode the response as a graphsync message
            const bytes = graphsyncMessage.Message.encode({
                completeRequestList: true,
                responses: [
                    {
                        id:requestId,
                        status: 20
                    }
                ],
                data: blocks
            })
            console.log('sending response message of length', bytes.length)

            // send the message to the requester
            pipe([bytes],
                lp.encode(),
                stream)
        },
        getRequest: (requestId) => {
            //console.log('requests=', requests)
            return requests[requestId]
        }
    }
}

module.exports = {
    create
}