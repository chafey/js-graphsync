const graphsyncMessage = require('./graphsync-message')
const dagCBOR = require('ipld-dag-cbor')
const lp = require('it-length-prefixed')
const { pipe } = require('it-pipe')

const create = async (node, peer) => {
    let nextRequestId = 0
    
    //console.log('peer =', peer)

    const { stream } = await node.dialProtocol(peer, '/ipfs/graphsync/1.0.0')

    console.log('Dialer dialed to listener on protocol: /ipfs/graphsync/1.0.0')

    return {
        sendRequest: (root, selector) => {
            const bytes = graphsyncMessage.Message.encode({
                completeRequestList: true,
                requests: [
                    {
                        id: nextRequestId++,
                        root: root.bytes,
                        selector: dagCBOR.util.serialize(selector),
                        priority: 0,
                        cancel: false,
                        update: false,
                    }
                ]
            })
            console.log('sending request message of length', bytes.length)

            pipe([bytes],
                lp.encode(),
                stream)
        },
        sendResponse: (requestId, blocks) => {
            const bytes = graphsyncMessage.Message.encode({
                completeRequestList: true,
                responses: [
                    {
                        id:requestId,
                        status: 20
                    }
                ]
            })
            console.log('sending response message of length', bytes.length)

            pipe([bytes],
                lp.encode(),
                stream)
        }
    }
}

module.exports = {
    create
}