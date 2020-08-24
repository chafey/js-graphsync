const graphSync = require('../src')
const assert = require('assert')
const Block = require('@ipld/block/defaults')
const createMemoryBlockStore = require('./create-memory-block-store')

const helloWorldBlock = Block.encoder({ hello: 'world' }, 'dag-cbor')

const createMockNetwork = () => {
    return {}
}

const createContext = () => {
    return {
    }
}

describe('Requester', () => {
    it('request succeeds', async () => {
        const mockNetwork = createMockNetwork()
        const memoryBlockStore = createMemoryBlockStore()
        const exchange = await graphSync.new(mockNetwork, memoryBlockStore.get, memoryBlockStore.put)
        assert.ok(exchange, 'failed to create graphsync exchange')
        const context = createContext()
        const root = await helloWorldBlock.cid()
        const selector = { fullGraph: true }

        const progress = await exchange.request(context, root, selector)

        assert.ok(progress, 'failed to create requestr')
        assert.doesNotReject(progress.complete(), 'progress.complete() returned rejected promise')
        //assert.equal(Object.keys(memoryBlockStore.blocks).length, 1)
    })
})