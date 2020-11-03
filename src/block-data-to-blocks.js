const codecFromPrefixBytes = require('../src/util/codec-from-prefix-bytes')

const blockDataToBlocks = (blockData, Block) => {
    return blockData.map((blockData) => {
        try {
            const codec = codecFromPrefixBytes(blockData.prefix)
            return Block.decoder(blockData.data, codec)
        } catch(err) {
            // ignore exceptions - instead return "undefined"
        }
    })
}

module.exports = blockDataToBlocks