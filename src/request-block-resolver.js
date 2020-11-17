const createRequestBlockResolver = (blockStore, peerBlockBuffer) => {
    return {
        get: async (cid) => {
            const block = await blockStore.get(cid)
            if(block) {
                return block
            }
            return await peerBlockBuffer.get(cid)
        }
    }
}

module.exports = createRequestBlockResolver