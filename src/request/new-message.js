const dagCBOR = require('ipld-dag-cbor')

const createNewMessage = (state) => {
    return {
        requests: [
            {
                id: state.id,
                root: state.rootCID.bytes,
                selector: dagCBOR.util.serialize(state.selector),
                cancel: false,
                update: false,
            }
        ]
    }
}

module.exports = createNewMessage