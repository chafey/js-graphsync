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
            return blocks[cidAsString]
        }
    }
}

module.exports = createMemoryBlockStore