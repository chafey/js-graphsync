const Block = require('@ipld/block/defaults')
const assert = require('assert')

const createMemoryBlockStore = require('../../helpers/memory-block-store')

describe('Memory Block Store', () => {
    it('Can Get Put Block', async () => {
        const store = createMemoryBlockStore()
        const block = Block.encoder({ hello: 'world' }, 'dag-cbor')
        assert.doesNotReject(store.put(block), 'put() failed')
        assert.equal(Object.keys(store.blocks).length, 1)
        const getBlock = assert.doesNotReject(store.get(await block.cid(), 'get() failed'))
    })
})

module.exports = createMemoryBlockStore
