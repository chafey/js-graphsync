const graphSync = require('../src')
const assert = require('assert')
const Block = require('@ipld/block/defaults')
const createMemoryBlockStore = require('../helpers/memory-block-store')
const selectors = require('../src/selectors')
const CID = require('cids')
const lp = require('it-length-prefixed')
const graphsyncMessage = require('../src/message/graphsync-message')
const pushable = require('it-pushable')
const PeerId = require('peer-id')
const { pipe } = require('it-pipe')

const helloWorldBlock = Block.encoder({ hello: 'world' }, 'dag-cbor')

describe('GraphExchange', () => {
    it('success', async () => {
        // setup our mock libp2p node
        const mockNode = {
            handle: async(protocol, handler) => {
            }
        }
        const blockStore = createMemoryBlockStore()
        
        const exchange = await graphSync.new(mockNode, blockStore.get, blockStore.put, console, Block)
        assert.ok(exchange, 'failed to create GraphExchange')
    })
})