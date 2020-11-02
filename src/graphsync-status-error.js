const responseStatusCodes = require('./message/response-status-codes')

class GraphsyncStatusError extends Error {
    constructor(status) {
        const message = responseStatusCodes.getDescription(status)
        super(message)
        this.name = "GraphsyncStatusError"
        this.status = status
    }
}

module.exports = GraphsyncStatusError