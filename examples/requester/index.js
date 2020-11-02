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

const main = async () => {
    // check number of arguments
    if(process.argv.length < 4) {
        console.log(`expected a multiaddr and a CID, got ${process.argv.length} args`)
        process.exit(-1)
    }
    const responderMultiAddr = multiaddr(process.argv[2])
    const rootCID = new CID(process.argv[3])

    // Create a libp2p node compatible with go-ipfs
    const node = await Libp2p.create({
        modules: {
            transport: [TCP],
            connEncryption: [NOISE, SECIO],
            streamMuxer: [MPLEX]
        }
    })

    // register the responder with the node
    const peerIdString = responderMultiAddr.getPeerId()
    const responderPeerId = PeerId.createFromB58String(peerIdString)
    node.peerStore.addressBook.set(responderPeerId, [responderMultiAddr])

    // Create a GraphExchange
    const blockStore = createMemoryBlockStore()
    const exchange = await graphSync.new(node, blockStore, console, Block)

    node.start()

    // Issue a request and wait for it to complete
    try {
        console.log('sending graphsync request')
        const request = await exchange.request(responderPeerId, rootCID, selectors.depthLimitedGraph)
        console.log('waiting for graphsync request to complete')
        await request.complete()
        console.log('graphsync request completed with status', request.status())
        // request is complete, get the block from the blockstore and print it out
        // TODO: traverse the graph printing out each block
        const block = await blockStore.get(rootCID)
        console.log(block.decode())
    } catch(err) {
        console.log('caught error', err)
    }
    
    // Stop the node so we can exit the program
    await node.stop()
}

main()