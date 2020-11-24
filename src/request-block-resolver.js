const createRequestBlockResolver = (blockStore, peerBlockBuffer) => {
    return {
        get: async (cid) => {
            const block = await blockStore.get(cid)
            if(block) {
                return block
            }
            const newBlock = await peerBlockBuffer.get(cid)
            await blockStore.put(newBlock)
            return newBlock
        }
    }
}

module.exports = createRequestBlockResolver