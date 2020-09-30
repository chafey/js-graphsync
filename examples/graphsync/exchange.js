const graphsyncMessage = require('./graphsync-message')
const dagCBOR = require('ipld-dag-cbor')
const lp = require('it-length-prefixed')
const { pipe } = require('it-pipe')

const create = async (node, listener) => {
    let nextRequestId = 0
    
    console.log('listener=', listener)

    const { stream } = await node.dialProtocol(listener, '/ipfs/graphsync/1.0.0')

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
            console.log('sending message of length', bytes.length)

            pipe([bytes],
                lp.encode(),
                stream)
        },
    }
}

module.exports = {
    create
}