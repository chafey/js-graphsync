const graphSync = require('../../src')
const selectors = require('../../src/selectors')

const Block = require('@ipld/block/defaults')
const PeerId = require('peer-id')
const multiaddr = require('multiaddr')
const CID = require('cids')

const Libp2p = require('libp2p')
const TCP = require('libp2p-tcp')
const multiaddr = require('multiaddr')
const { NOISE } = require('libp2p-noise')
const MPLEX = require('libp2p-mplex')
const SECIO = require('libp2p-secio')

const createMemoryBlockStore = require('../../helpers/memory-block-store')

// this is the block we will retrieve from the graphsync responder, it needs to be stored previously
const helloWorldBlock = Block.encoder({ hello: 'world' }, 'dag-cbor') // bafyreidykglsfhoixmivffc5uwhcgshx4j465xwqntbmu43nb2dzqwfvae

const main = () => {
    // Create a libp2p node compatible with go-ipfs
    const node = Libp2p.create({
        modules: {
            transport: [TCP],
            connEncryption: [NOISE, SECIO],
            streamMuxer: [MPLEX]
        }
    })

    // register the responder with the node
    const responderMultiAddr = multiaddr('/ip4/127.0.0.1/tcp/10333/p2p/QmcrQZ6RJdpYuGvZqD5QEHAv6qX4BrQLJLQPQUrTrzdcgm')
    const responderPeerId = responderMultiAddr.getPeerId() //'QmcrQZ6RJdpYuGvZqD5QEHAv6qX4BrQLJLQPQUrTrzdcgm'
    node.peerStore.addressBook.set(PeerId.createFromB58String(responderPeerId), [responderMultiAddr])

    // Create a GraphExchange
    const blockStore = createMemoryBlockStore()
    const exchange = await graphSync.new(mockNode, blockStore.get, blockStore.put, console, Block)

    // Issue a request for the helloWorldBlock and wait for it to complete
    const root = new CID('bafyreidykglsfhoixmivffc5uwhcgshx4j465xwqntbmu43nb2dzqwfvae') // helloWorldBlock CID
    const request = await exchange.request(responderPeerId, root, selectors.exploreAll)
    await request.complete()

    // request is complete, get the block from the blockstore and print it out - it shoudl be the hello world json block
    const block = await blockSttore.get(root)
    console.log(block)

}

main()