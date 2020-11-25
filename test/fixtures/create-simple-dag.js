const Block = require('@ipld/block/defaults')

const blockEncode = async (obj) => {
    const block = await Block.encoder(obj, "dag-cbor")
    const cid = await block.cid()
    return {block, cid}
}

const createSimpleDAG = async() => {
    const leaf1 = await blockEncode({leaf: "one"})
    const leaf2 = await blockEncode({leaf: "two"})
    const root = await blockEncode({child1: leaf1.cid, child2: leaf2.cid})
    return [root, leaf1, leaf2]
}
module.exports = createSimpleDAG