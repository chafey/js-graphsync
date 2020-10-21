const sendMessage = require("./send-message")
const dagCBOR = require('ipld-dag-cbor')

const createRequest = async (node, requestId, peerId, rootCID, selector) => {

    // internal private request state
    const requestState = {
        status: 0,
        blocksReceived: 0,
        completed: new Promise()
    }

    // response handler
    const responseHandler = (response, data) => {
        requestState.status = response.status
        if(response.status > 20) {
            requestState.completed.resolve()
        }
    }

    // create request object
    const request = {
        // returns information about the request
        info: () => {
            return {
                peerId,
                id: requestId,
                rootCID,
                selector
            }
        },
        // resolves once the request has completed
        complete: async () => {
            return requestState.completed
        },
        // tells the responder to cancel the request, returns once request has been sent
        cancel: async() => {
            // create cancel message
            // send to peer
        },
        // returns the current status of the request
        status: () => {
            return {
                blocksReceived: requestState.blocksReceived,
                status: requestState.status
            }
        }
    }

    // create graphsync message for request
    const message = {
        requests: [
            {
                id: requestId,
                root: rootCID.bytes,
                selector: dagCBOR.util.serialize(selector),
                priority: 0,
                cancel: false,
                update: false,
            }
        ]
    }

    // send message to peer
    sendMessage(node, peerId, message) 

    // return request object and response handler function
    return {request, responseHandler}
} 

module.exports = createRequest