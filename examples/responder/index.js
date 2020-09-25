const PeerId = require('peer-id')
const peerIdJSON = require('./peer-id.json')
const Libp2p = require('libp2p')
const TCP = require('libp2p-tcp')
const { NOISE } = require('libp2p-noise')
const SECIO = require('libp2p-secio')
const MPLEX = require('libp2p-mplex')
const pipe = require('it-pipe')
const lp = require('it-length-prefixed')
const messages = require('../../src/message/pb/message_pb');
const dagCBOR = require('ipld-dag-cbor')
const CID = require('cids')

main = async () => {

    const peerId = await PeerId.createFromJSON(peerIdJSON)

    const node = await Libp2p.create({
        addresses: {
            listen: ['/ip4/0.0.0.0/tcp/10333']
        },
        modules: {
            transport: [TCP],
            connEncryption: [SECIO, NOISE],
            streamMuxer: [MPLEX]
        },
        peerId
    })

    // Log a message when we receive a connection
    node.connectionManager.on('peer:connect', (connection) => {
        console.log('received dial from:', connection.remotePeer.toB58String())
    })

    // Handle incoming connections for the protocol
    await node.handle('/ipfs/graphsync/1.0.0', async ({ stream }) => {
        console.log("received graphsync message")

        await pipe(
            stream, 
            lp.decode(),
            async function (source) {
                for await (const data of source) {
                    const message = messages.Message.deserializeBinary(data.slice())
                    //console.log(message.toObject())
                    // process each request
                    message.getRequestsList().forEach(request => {
                        const root = new CID(request.getRoot())
                        console.log('root=', root)
                        const selector = dagCBOR.util.deserialize(request.getSelector())
                        console.log('selector=', selector)
                    })
                }
            }
        )
    })

    // Start listening
    await node.start()

    console.log('Listener ready, listening on:')
    node.multiaddrs.forEach((ma) => {
      console.log(ma.toString() + '/p2p/' + peerId.toB58String())
    })

    return 0
}

main().then((result) => {
    console.log('success: result = ', result)
    
    //process.exit(result)
}).catch((error) => {
    console.log('error: ', error)
    process.exit(-1)
})

