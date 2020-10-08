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
    it('creation returns object', async () => {
        // setup our mock libp2p node
        const mockNode = {
            handle: async(protocol, handler) => {
            }
        }
        const blockStore = createMemoryBlockStore()
        
        const exchange = await graphSync.new(mockNode, blockStore.get, blockStore.put, console, Block)
        assert.ok(exchange, 'failed to create GraphExchange')
    })

    it('creation registers graphsync protocol handler', async () => {
        // setup our mock libp2p node
        let handlers = []
        const mockNode = {
            handle: async(protocol, handler) => {
                handlers.push({protocol, handler})
            }
        }
        
        const blockStore = createMemoryBlockStore()
        
        const exchange = await graphSync.new(mockNode, blockStore.get, blockStore.put, console, Block)
        assert.ok(exchange, 'failed to create GraphExchange')
        assert.strictEqual(handlers.length, 1)
        assert.strictEqual(handlers[0].protocol, '/ipfs/graphsync/1.0.0')
        assert.ok(handlers[0].handler)

    })

    it('request creates connection to peer', async () => {
        // setup our mock libp2p node
        const dials = []
        const mockNode = {
            handle: async() => {},
            dialProtocol: async(peerId, protocols, options) => {
                dials.push({
                    peerId,
                    protocols,
                    options
                })
                return {
                    stream : async(source) => {}
                }
            }
        }
        const blockStore = createMemoryBlockStore()
        
        const exchange = await graphSync.new(mockNode, blockStore.get, blockStore.put, console, Block)
        assert.ok(exchange, 'failed to create GraphExchange')

        const responderPeerId = 'QmcrQZ6RJdpYuGvZqD5QEHAv6qX4BrQLJLQPQUrTrzdcgm'
        const root = new CID('bafyreidykglsfhoixmivffc5uwhcgshx4j465xwqntbmu43nb2dzqwfvae') // helloWorldBlock CID
        const request = await exchange.request(responderPeerId, root, selectors.exploreAll)
        assert.ok(request, 'failed to create request')
        assert.strictEqual(dials.length, 1)
    })

    it('request reuses existing connection to peer', async () => {
        // setup our mock libp2p node
        const dials = []
        const mockNode = {
            handle: async() => {},
            dialProtocol: async(peerId, protocols, options) => {
                dials.push({
                    peerId,
                    protocols,
                    options
                })
                return {
                    stream : async(source) => {}
                }
            }
        }
        const blockStore = createMemoryBlockStore()
        
        const exchange = await graphSync.new(mockNode, blockStore.get, blockStore.put, console, Block)
        assert.ok(exchange, 'failed to create GraphExchange')

        const responderPeerId = 'QmcrQZ6RJdpYuGvZqD5QEHAv6qX4BrQLJLQPQUrTrzdcgm'
        const root = new CID('bafyreidykglsfhoixmivffc5uwhcgshx4j465xwqntbmu43nb2dzqwfvae') // helloWorldBlock CID
        const request = await exchange.request(responderPeerId, root, selectors.exploreAll)
        assert.ok(request, 'failed to create request')
        assert.strictEqual(dials.length, 1)
        const request2 = await exchange.request(responderPeerId, root, selectors.exploreAll)
        assert.strictEqual(dials.length, 1)
    })

    it('request sends one GraphSync message', async () => {
        // setup our mock libp2p node
        const outboundData = []
        const mockNode = {
            handle: async() => {},
            dialProtocol: async(peerId, protocols, options) => {
                return {
                    stream : async(source) => {
                        for await (const data of source) {
                            outboundData.push(data)
                        }
                    }
                }
            }
        }
        const blockStore = createMemoryBlockStore()
        
        const exchange = await graphSync.new(mockNode, blockStore.get, blockStore.put, console, Block)
        assert.ok(exchange, 'failed to create GraphExchange')

        const responderPeerId = 'QmcrQZ6RJdpYuGvZqD5QEHAv6qX4BrQLJLQPQUrTrzdcgm'
        const root = new CID('bafyreidykglsfhoixmivffc5uwhcgshx4j465xwqntbmu43nb2dzqwfvae') // helloWorldBlock CID
        const request = await exchange.request(responderPeerId, root, selectors.exploreAll)
        assert.ok(request, 'failed to create request')
        assert.strictEqual(outboundData.length, 1)
        const messageIterator = await lp.decode()(outboundData)
        const messageBytes = (await messageIterator.next()).value
        const message = graphsyncMessage.Message.decode(messageBytes.slice())
    })

    it('handles inbound GraphSync stream', async () => {
        // setup our mock libp2p node
        let registeredHandler = undefined
        const mockNode = {
            handle: async(protocol, handler) => {
                registeredHandler = handler
            },
            dialProtocol: async(peerId, protocols, options) => {
                return {
                    stream : async(source) => {
                    }
                }
            }
        }
        const blockStore = createMemoryBlockStore()
        
        const exchange = await graphSync.new(mockNode, blockStore.get, blockStore.put, console, Block)
        assert.ok(exchange, 'failed to create GraphExchange')

        const connection = {
            remotePeer: PeerId.createFromCID('QmcrQZ6RJdpYuGvZqD5QEHAv6qX4BrQLJLQPQUrTrzdcgm')
        }
        const stream = pushable()
        const protocol = '/ipfs/graphsync/1.0.0'
        registeredHandler({connection, stream, protocol})
    })

    it('receives graphsync message', async () => {
        // setup our mock libp2p node
        let registeredHandler = undefined
        const mockNode = {
            handle: async(protocol, handler) => {
                registeredHandler = handler
            },
            dialProtocol: async(peerId, protocols, options) => {
                return {
                    stream : async(source) => {
                    }
                }
            }
        }
        const blockStore = createMemoryBlockStore()
        
        const exchange = await graphSync.new(mockNode, blockStore.get, blockStore.put, console, Block)
        assert.ok(exchange, 'failed to create GraphExchange')

        const connection = {
            remotePeer: PeerId.createFromCID('QmcrQZ6RJdpYuGvZqD5QEHAv6qX4BrQLJLQPQUrTrzdcgm')
        }
        const stream = pushable()
        const protocol = '/ipfs/graphsync/1.0.0'
        registeredHandler({connection, stream, protocol})
        
        const bytes = graphsyncMessage.Message.encode({
            completeRequestList: true,
            responses: [
                {
                    id:0,
                    status: 20
                }
            ]
        })
        // send the message to the requester
        await pipe([bytes],
            lp.encode(),
            async (source) => {
                for await (const data of source) {
                    stream.push(data)
                }
            }
        )
    })

})