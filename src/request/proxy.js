// creates a proxy object for a request that consumers of this library interact with.

const createRequestProxy = (requestState) => {
    
    const info = () => {
        return {
            id: requestState.id,
            peerId: requestState.peerId,
            rootCID: requestState.rootCID,
            selector: requestState.selector,
        }
    }

    // returns a promise that resolves once the responder returns a terminal status
    const complete = async () => {
        return requestState.completed
    }

    // sends a cancel message to a responder  
    const cancel = () => {
    }

    const status = () => {
        return {
            blocksReceived: requestState.blocksReceived,
            bytesReceived: requestState.bytesReceived,
            status: requestState.status
        }
    }

    return {
        info,
        complete,
        cancel,
        status
    }
}

module.exports = createRequestProxy