const createResponseMessageHandler = (getRequestMutator) => {

    return async (peerIdAsString, message) => {
        for await(response of message.responses) {
            const requestMutator = getRequestMutator(peerIdAsString, response.id)
            requestMutator.setStatus(response.status)
        }
    }
}

module.exports = createResponseMessageHandler