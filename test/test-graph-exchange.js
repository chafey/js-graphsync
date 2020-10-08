const graphSync = require('../src')
const assert = require('assert')
const Block = require('@ipld/block/defaults')
const createMemoryBlockStore = require('../helpers/memory-block-store')
const createMockLibp2pNode = require('./mocks/libp2p-node')
const selectors = require('../src/selectors')
const CID = require('cids')

const helloWorldBlock = Block.encoder({ hello: 'world' }, 'dag-cbor')

describe('GraphExchange', () => {
    it('creation succeeds', async () => {
        // setup our mock libp2p node
        const mockNode = createMockLibp2pNode()
        const blockStore = createMemoryBlockStore()
        
        const exchange = await graphSync.new(mockNode, blockStore.get, blockStore.put, console, Block)
        assert.ok(exchange, 'failed to create graphsync exchange')
    })

    it('request completes', async () => {
        // setup our mock libp2p node
        const mockNode = createMockLibp2pNode()
        const blockStore = createMemoryBlockStore()
        
        const exchange = await graphSync.new(mockNode, blockStore.get, blockStore.put, console, Block)
        assert.ok(exchange, 'failed to create GraphExchange')

        const responderPeerId = 'QmcrQZ6RJdpYuGvZqD5QEHAv6qX4BrQLJLQPQUrTrzdcgm'
        const root = new CID('bafyreidykglsfhoixmivffc5uwhcgshx4j465xwqntbmu43nb2dzqwfvae') // helloWorldBlock CID
        const request = await exchange.request(responderPeerId, root, selectors.exploreAll)
        assert.ok(request, 'failed to create request')
        await request.complete()
        assert.equal(Object.keys(blockStore.blocks).length, 1)
    })

    it('request to unknown peer fails', async () => {
        // setup our mock libp2p node
        const mockNode = createMockLibp2pNode()
        const blockStore = createMemoryBlockStore()
        
        const exchange = await graphSync.new(mockNode, blockStore.get, blockStore.put, console, Block)
        assert.ok(exchange, 'failed to create GraphExchange')

        const responderPeerId = 'QmcrQZ6RJdpYuGvZqD5QEHAv6qX4BrQLJLQPQUrTrzdcgm'
        const root = new CID('bafyreidykglsfhoixmivffc5uwhcgshx4j465xwqntbmu43nb2dzqwfvae') // helloWorldBlock CID
        const request = await exchange.request(responderPeerId, root, selectors.exploreAll)
        assert.ok(request, 'failed to create request')
        await request.complete()
    })


})