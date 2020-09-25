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
    const node = await Libp2p.create({
        modules: {
            transport: [TCP],
            connEncryption: [SECIO, NOISE],
            streamMuxer: [MPLEX]
        }
    })

    // create listener for response/block messages sent from responder
    await node.handle('/ipfs/graphsync/1.0.0', async ({ stream }) => {
        console.log("received graphsync message")

        await pipe(
            stream, 
            lp.decode(),
            async function (source) {
                for await (const data of source) {
                    const message = messages.Message.deserializeBinary(data.slice())
                    console.log(message.toObject())
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

    // Start the dialer libp2p node
    await node.start()

    // Dial the responder node
    const responderMultiAddr = '/ip4/127.0.0.1/tcp/10333/p2p/QmcrQZ6RJdpYuGvZqD5QEHAv6qX4BrQLJLQPQUrTrzdcgm'
    console.log('Dialing to peer:', responderMultiAddr)
    const { stream } = await node.dialProtocol(responderMultiAddr, '/ipfs/graphsync/1.0.0')

    console.log('dialed responder on protocol: /ipfs/graphsync/1.0.0')

    const requestMessage = new messages.Message.Request()
    requestMessage.setId(1)
    requestMessage.setRoot(new CID('Qme98eG7WKx6VEqf3Jza7rp9CRXgSHD7o8SL5KoDggH2VX').bytes)
    requestMessage.setSelector(dagCBOR.util.serialize({
        "a": {
            ">": {
                ".": {}
            }
        }
    }))
    requestMessage.setPriority(1)
    requestMessage.setCancel(false)
    requestMessage.setUpdate(false)
    const message = new messages.Message()
    message.setCompleterequestlist(true)
    message.addRequests(requestMessage)
    const bytes = message.serializeBinary();

    pipe(
        [bytes],
        lp.encode(),
        stream
    )

    return 0
}

main().then((result) => {
    console.log('success: result = ', result)
    
    //process.exit(result)
}).catch((error) => {
    console.log('error: ', error)
    process.exit(-1)
})

