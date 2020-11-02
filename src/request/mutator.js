const isTerminalStatus = require('../util/is-terminal-status')
const GraphsyncStatusError = require('../graphsync-status-error')

const createRequestMutator = (requestState) => {
    
    const setStatus = (state) => {

        // Do not allow status changes after request has completed
        if(isTerminalStatus(requestState.status)) {
            throw new Error('cannot change status after request is completed')
        }

        // update status
        requestState.status = state

        // resolve our promise for terminal statuses (success and error)
        if(isTerminalStatus(requestState.status)) {
            if(requestState.status >= 30) {
                requestState.promiseReject(new GraphsyncStatusError(requestState.status))
            } else {
                requestState.promiseResolve()
            }
        }
    }

    const updateBlockStats = (blockData) => {
        // Do not allow changes after request is completed
        if(isTerminalStatus(requestState.status)) {
            throw new Error('cannot update block stats after request is completed')
        }
        
        requestState.blocksReceived += 1
        requestState.bytesReceived += blockData.data.length
    }

    return {
        setStatus,
        updateBlockStats
    }
} 

module.exports = createRequestMutator