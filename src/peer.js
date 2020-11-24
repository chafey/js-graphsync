const createBlockBuffer = require('./block-buffer')

const createPeer = () => {
    let nextRequestId = 0
    const requests = []
    const blockBuffer = createBlockBuffer()

    const createRequest = (rootCID, selector) => {
        const request = {
            id : nextRequestId++
        }
        requests.push(request)
        return request
    }

    const handleMessage = async (message) => {
        // block handling
            // convert block data into blocks
            // filter blocks by response metadata
            // add blocks to blockBuffer

        // response handling

        // request handling

    }

    return {
        createRequest,
        handleMessage
    }
}

module.exports = createPeer