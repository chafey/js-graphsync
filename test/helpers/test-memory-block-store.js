const Block = require('@ipld/block/defaults')
const assert = require('assert')

const createMemoryBlockStore = require('../../helpers/memory-block-store')

describe('Memory Block Store', () => {
    it('Can Get Put Block', async () => {
        const store = createMemoryBlockStore()
        const block = await Block.encoder({ hello: 'world' }, 'dag-cbor')
        await store.put(block) // should not fail
        assert.strictEqual(Object.keys(store.blocks).length, 1)
        const getBlock = await store.get(await block.cid())
        //console.log('getBlock=',getBlock)
    })
})

module.exports = createMemoryBlockStore
