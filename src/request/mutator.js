const isTerminalStatus = (status) => {
    return status >= 20
}

const createRequestMutator = (requestState) => {
    
    const handleResponse = (response, data) => {
        // ignore any responses after we have hit a terminal status
        if(isTerminalStatus(requestState.status)) {
            // TODO: Log warning?
            console.warn('ignoring response for request that has already completed')
            return
        }
        
        // update status
        requestState.status = response.status

        // TODO: Process each block
        requestState.blocksReceived += data.length

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