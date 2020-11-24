const codecFromPrefixBytes = require('../src/util/codec-from-prefix-bytes')

async function* generateBlocksFromBlockData(blockData, Block) {
    for await (blockData of blockData) {
        try {
            const codec = codecFromPrefixBytes(blockData.prefix)
            const block = Block.decoder(blockData.data, codec)
            const cid = await block.cid()
            yield {cid, block}
        } catch(err) {
            yield {err}
        }
    }
}

module.exports = generateBlocksFromBlockData