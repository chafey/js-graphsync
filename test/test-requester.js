const graphSync = require('../src')
const assert = require('assert')
const Block = require('@ipld/block/defaults')
const createMemoryBlockStore = require('../helpers/memory-block-store')
const selectors = require('../src/selectors')
const createMockLibp2pNode = require('./mocks/libp2p-node')
const multiaddr = require('multiaddr')
const createNetwork = require('../src/network')
const PeerId = require('peer-id')
const CID = require('cids')

const helloWorldBlock = Block.encoder({ hello: 'world' }, 'dag-cbor') // bafyreidykglsfhoixmivffc5uwhcgshx4j465xwqntbmu43nb2dzqwfvae
/*
describe('Requester', () => {
    it('request succeeds', async () => {
        const responderMultiAddr = multiaddr('/ip4/127.0.0.1/tcp/10333/p2p/QmcrQZ6RJdpYuGvZqD5QEHAv6qX4BrQLJLQPQUrTrzdcgm')
        const responderPeerId = responderMultiAddr.getPeerId() //'QmcrQZ6RJdpYuGvZqD5QEHAv6qX4BrQLJLQPQUrTrzdcgm'
        const mockNode = createMockLibp2pNode()
        mockNode.peerStore.addressBook.set(PeerId.createFromB58String(responderPeerId), [responderMultiAddr])
        const blockStore = createMemoryBlockStore()
        const exchange = await graphSync.new(mockNode, blockStore.get, blockStore.put, console, Block)
        assert.ok(exchange, 'failed to create graphsync exchange')
        const root = new CID('bafyreidykglsfhoixmivffc5uwhcgshx4j465xwqntbmu43nb2dzqwfvae') // helloWorldBlock CID
        const request = await exchange.request(responderPeerId, root, selectors.exploreAll)
        assert.ok(request, 'failed to create requester')
        assert.doesNotReject(request.complete(), 'request.complete() returned rejected promise')
        //assert.equal(Object.keys(blockStore.blocks).length, 1)
    })
})*/