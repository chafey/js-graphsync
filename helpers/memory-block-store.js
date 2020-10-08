const createMemoryBlockStore = () => {
    const blocks = {}

    return {
        blocks: blocks,
        put: async block => {
            blocks[block.cid().then(cid => cid.toString())] = block
        },
        get: async cid => {
            return blocks[cid.toString()]
        }
    }
}

module.exports = createMemoryBlockStore