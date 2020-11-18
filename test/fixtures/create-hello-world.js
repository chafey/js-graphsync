const Block = require('@ipld/block/defaults')

const createHelloWorld = async () => {
    const block = await Block.encoder({ hello: 'world' }, 'dag-cbor')
    const cid = await block.cid()
    return {
        block,
        cid
    }
}

module.exports = createHelloWorld