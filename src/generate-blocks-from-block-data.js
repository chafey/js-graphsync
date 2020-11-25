const codecFromPrefixBytes = require('../src/util/codec-from-prefix-bytes')

/**
 * Generator function that decodes block data in graphsync messages into
 * objects that contain the corresponding cid and block, or err in the
 * case an error is encountered decoding that block (e.g. unknown codec)
 * 
 * @param {*} blockData 
 * @param {*} Block 
 */

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