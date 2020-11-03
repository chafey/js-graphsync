const prefixBytesFromCIDBytes = require('../src/util/prefix-bytes-from-cid-bytes')

const blocksToBlockData = async (blocks) => {
    return Promise.all(blocks.map(async(block) => {
        return {
            prefix: prefixBytesFromCIDBytes((await block.cid()).bytes),
            data: block.encode()
        }
    }))
}

module.exports = blocksToBlockData