const dagCBOR = require('ipld-dag-cbor')


const isTerminalStatus = (status) => {
    return status >= 20
}

const dumpExtensions = (extensions) => {
    console.log("extensions:")
    for(const extension in extensions) {
        if(extension == 'graphsync/response-metadata') {
            console.log('graphsync/response-metadata=', dagCBOR.util.deserialize(extensions[extension]))
        } else {
            console.log(extension)
        }
    }
}

const createRequestMutator = (requestState) => {
    
    const handleResponse = (response, data) => {
        //dumpExtensions(response.extensions)

        //console.log(`received response with status ${response.status} and ${data.length} blocks`)

        // ignore any responses after we have hit a terminal status
        if(isTerminalStatus(requestState.status)) {
            // TODO: Log warning?
            //console.warn('ignoring response for request that has already completed')
            return
        }
        
        // update status
        requestState.status = response.status

        // TODO: Process each block (using response metadata)
        requestState.blocksReceived += data.length
        requestState.bytesReceived += data.reduce((total, block) => {
            return total + block.data.length
        },0)

        // resolve our promise for terminal statuses (success and error)
        if(isTerminalStatus(requestState.status)) {
            requestState.promiseResolve()
        }
    }
    
    return {
        handleResponse,
    }
} 

module.exports = createRequestMutator