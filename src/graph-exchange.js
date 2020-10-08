const createRequest = require('./request')

const newGraphExchange = async (node, blockStoreGet, blockStorePut, logger, block) => {
    return {
        request: async (responderPeerId, rootCID, selector) => {
            return await createRequest()
        }
    }
}

module.exports = newGraphExchange