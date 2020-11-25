/**
 * Creates a requestBlockResolver which will look up a block in the block store and
 * return it if found.  If not found, it will call get on a block buffer and store
 * it in the block store when resolved. 
 * @param {*} blockStore 
 * @param {*} peerBlockBuffer 
 */

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