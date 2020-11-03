const Block = require('@ipld/block/defaults')

const createSimpleDAG = async() => {
    const leaf1 = await Block.encoder({leaf: "one"}, "dag-cbor")
    const leaf2 = await Block.encoder({leaf: "two"}, "dag-cbor")
    const root = await Block.encoder({child1: await leaf1.cid(), child2: await leaf2.cid()}, "dag-cbor")
    return [root, leaf1, leaf2]
}
module.exports = createSimpleDAG