const graphSync = require('../../src')
const selectors = require('../../src/selectors')

const Block = require('@ipld/block/defaults')
const PeerId = require('peer-id')
const multiaddr = require('multiaddr')
const CID = require('cids')

const Libp2p = require('libp2p')
const TCP = require('libp2p-tcp')
const { NOISE } = require('libp2p-noise')
const MPLEX = require('libp2p-mplex')
const SECIO = require('libp2p-secio')

const createMemoryBlockStore = require('../../helpers/memory-block-store')

// this is the block we will retrieve from the graphsync responder, it needs to be stored previously
const helloWorldBlock = Block.encoder({ hello: 'world' }, 'dag-cbor') // bafyreidykglsfhoixmivffc5uwhcgshx4j465xwqntbmu43nb2dzqwfvae

const main = async () => {
    // Create a libp2p node compatible with go-ipfs
    const node = await Libp2p.create({
        modules: {
            transport: [TCP],
            connEncryption: [NOISE, SECIO],
            streamMuxer: [MPLEX]
        }
    })

    // register the responder with the node
    const responderMultiAddr = multiaddr('/ip4/127.0.0.1/tcp/4001/p2p/QmW7486gy8scYpx6FGxKdVfDmpsEnwWXYac49x7VspFqpp') // go-ipfs
    //const responderMultiAddr = multiaddr(`/ip4/127.0.0.1/tcp/4001/p2p/${peerId}`)
    //const responderMultiAddr = multiaddr('/ip4/127.0.0.1/tcp/10333/p2p/QmcrQZ6RJdpYuGvZqD5QEHAv6qX4BrQLJLQPQUrTrzdcgm') // js-responder
    const peerIdString = responderMultiAddr.getPeerId() //'QmcrQZ6RJdpYuGvZqD5QEHAv6qX4BrQLJLQPQUrTrzdcgm'
    const responderPeerId = PeerId.createFromB58String(peerIdString)
    node.peerStore.addressBook.set(responderPeerId, [responderMultiAddr])

    // Create a GraphExchange
    const blockStore = createMemoryBlockStore()
    const exchange = await graphSync.new(node, blockStore.get, blockStore.put, console, Block)

    node.start()

    // Issue a request for the helloWorldBlock and wait for it to complete
    //const root = new CID('QmS3V8uLR5bzjxBWzC4oXxSV7ryStjCGxTuTiuB91sMR9c') // go1.15.2.linux-amd64.tar.gz
    //const root = new CID('bafyreidykglsfhoixmivffc5uwhcgshx4j465xwqntbmu43nb2dzqwfvae') // helloWorldBlock CID
    const root = new CID('Qme98eG7WKx6VEqf3Jza7rp9CRXgSHD7o8SL5KoDggH2VX') // helloWorldBlock CID
    try {
        const request = await exchange.request(responderPeerId, root, selectors.depthLimitedGraph)
        console.log('waiting for request to complete')
        await request.complete()
        console.log('request completed with status', request.status())
    } catch(err) {
        console.log('unexpected error', err)
    }
    // request is complete, get the block from the blockstore and print it out - it shoudl be the hello world json block
    //const block = await blockStore.get(root)
    //console.log(block)
    await node.stop()
}

main()