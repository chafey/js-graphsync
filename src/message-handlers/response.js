const createResponseMessageHandler = (getRequestMutator) => {

    return async (peerIdAsString, message) => {
        for await(response of message.responses) {
            const requestMutator = getRequestMutator(peerIdAsString, response.id)
            if(!requestMutator) {
                return
            }
            try {
                requestMutator.setStatus(response.status)
            } catch(err) {
                // console.log(err)
            }
        }
    }
}

module.exports = createResponseMessageHandler