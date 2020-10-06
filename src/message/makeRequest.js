const dagCBOR = require('ipld-dag-cbor')
const graphsyncMessage = require('./graphsync-message')

const makeRequest = async(root, selector) => {
    const bytes = graphsyncMessage.Message.encode({
        completeRequestList: true,
        requests: [
            {
                id: 0,
                root: root.bytes,
                selector: dagCBOR.util.serialize(selector),
                priority: 1,
                cancel: false,
                update: false,
            }
        ]
    })
    return bytes
}


module.exports = makeRequest