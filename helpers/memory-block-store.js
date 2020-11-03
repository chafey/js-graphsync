const createMemoryBlockStore = () => {
    const blocks = {}

    return {
        blocks: blocks,
        put: async block => {
            const cidAsString = (await block.cid()).toString()
            blocks[cidAsString] = block
        },
        get: async cid => {
            const cidAsString = cid.toString()
            const block = blocks[cidAsString]
            if(!block) {
                return Promise.reject("block not found")
            } else {
                return block
            }
        }
    }
}

module.exports = createMemoryBlockStore