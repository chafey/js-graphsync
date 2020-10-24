const PeerId = require('peer-id')
const peerIdJSON = require('./peer-id.json')
const Libp2p = require('libp2p')
const TCP = require('libp2p-tcp')
const { NOISE } = require('libp2p-noise')
const SECIO = require('libp2p-secio')
const MPLEX = require('libp2p-mplex')
const pipe = require('it-pipe')
const lp = require('it-length-prefixed')
//const messages = require('../../src/message/pb/message_pb');
const dagCBOR = require('ipld-dag-cbor')
const CID = require('cids')
const Block = require('@ipld/block/defaults')
const multicodec = require('multicodec')
const uint8ArrayConcat = require('uint8arrays/concat')
const pushable = require('it-pushable')

const protons = require('protons')
const fs = require('fs')
const path = require('path')
const graphsyncMessage = protons(fs.readFileSync(path.resolve(__dirname, '../../src/message/message.proto')))

const dumpExtensions = (extensions) => {
    console.log("extensions:")
    for(const extension in extensions) {
        if(extension == 'graphsync/response-metadata') {
            console.log('graphsync/response-metadata=', dagCBOR.util.deserialize(extensions[extension]))
        } else {
            console.log(extension)
        }
    }
}


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

        const pushSource = pushable()
        pipe(
            pushSource,
            lp.encode(),
            stream.sink
        )

        await pipe(
            stream.source, 
            lp.decode(),
            async function (source) {
                const responses = []
                for await (const data of source) {
                    const message = graphsyncMessage.Message.decode(data.slice())
                    //console.log(message)
                    // process each request
                    message.requests.forEach(async (request) => {
                        console.log('id=', request.id)
                        const root = new CID(request.root)
                        console.log('root=', root)
                        const selector = dagCBOR.util.deserialize(request.selector)
                        console.log('selector=', JSON.stringify(selector))
                        dumpExtensions(request.extensions)
                        console.log('priority=', request.priority)
                        console.log('cancel=', request.cancel)
                        console.log('update=', request.update)
                        /*const responseMessage = new messages.Message.Response()
                        responseMessage.setId(request.getId())
                        responseMessage.setStatus(20)//request completed, full content
                        const message = new messages.Message()
                        message.setCompleterequestlist(false)
                        message.addResponses(responseMessage)
                    
                        // TODO: the client/requester never receives this message for some reason and I am not
                        // sure why yet
                        const bytes = message.serializeBinary();
                        console.log('sending response message of length ', bytes.length)
                        pushSource.push(bytes)
                        */
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

