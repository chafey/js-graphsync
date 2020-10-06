const graphSync = require('../src')
const assert = require('assert')
const Block = require('@ipld/block/defaults')
const createMemoryBlockStore = require('./create-memory-block-store')
const createMockLibp2pNode = require('./mocks/libp2p-node')

const helloWorldBlock = Block.encoder({ hello: 'world' }, 'dag-cbor')

describe('GraphExchange', () => {
    it('creation succeeds', async () => {
        // setup our mock libp2p node
        const mockNode = createMockLibp2pNode()
        const blockStore = createMemoryBlockStore()
        
        const exchange = await graphSync.new(mockNode, blockStore.get, blockStore.put, console, Block)
        assert.ok(exchange, 'failed to create graphsync exchange')
    })
})