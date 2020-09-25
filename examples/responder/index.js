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
const Block = require('@ipld/block/defaults')
const multicodec = require('multicodec')
const uint8ArrayConcat = require('uint8arrays/concat')

const getPrefix = (cid) => {
    const codec = multicodec.getCodeVarint(cid.codec)
    const multihash = mh.prefix(cid.multihash)
    const prefix = uint8ArrayConcat([
      [cid.version], codec, multihash
    ], 1 + codec.byteLength + multihash.byteLength)

    return prefix
  }

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
                    message.getRequestsList().forEach(async (request) => {
                        console.log('id=', request.getId())
                        const root = new CID(request.getRoot())
                        console.log('root=', root)
                        const selector = dagCBOR.util.deserialize(request.getSelector())
                        console.log('selector=', selector)
                        console.log('priority=', request.getPriority())

                        const responseMessage = new messages.Message.Response()
                        responseMessage.setId(request.getId())
                        responseMessage.setStatus(20 /* request completed, full content*/)
                        const message = new messages.Message()
                        message.setCompleterequestlist(false)
                        message.addResponses(responseMessage)
                    
                        /*
                        // TODO: return a hard coded "hello world" block for now
                        const block = Block.encoder({ hello: 'world' }, 'dag-cbor')
                        const cid = await block.cid()
                        const prefix = getPrefix(cid) // TODO: getPrefix() fails right now, need to debug
                        console.log('prefix=', prefix)
                        const blockMessage = new messages.Message.Block()
                        blockMessage.setPrefix(prefix)
                        blockMessage.setData(block.encode())
                        message.addData(blockMessage)
                        */

                        // TODO: the client/requester never receives this message for some reason and I am not
                        // sure why yet
                        const bytes = message.serializeBinary();
                        console.log('sending response message of length ', bytes.length)
                        await pipe(
                            [bytes],
                            lp.encode(),
                            stream
                        )
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

