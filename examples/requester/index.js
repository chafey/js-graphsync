const Libp2p = require('libp2p')
const TCP = require('libp2p-tcp')
const { NOISE } = require('libp2p-noise')
const SECIO = require('libp2p-secio')
const MPLEX = require('libp2p-mplex')
const pipe = require('it-pipe')
const lp = require('it-length-prefixed')
const messages = require('../../src/message/pb/message_pb');
const dagCBOR = require('ipld-dag-cbor')
//const dagPB = require('@ipld/dag-pb')
//const dagPB = require('ipld-dag-pb')
const CID = require('cids')
const Block = require('@ipld/block/defaults')

//Block.multiformats.add(dagPB)

const prefixFromBytes = (bytes) => {
    const firstByte = bytes.slice(0, 1)
    const v = parseInt(bytes.toString('hex'), 16)
    if (v === 1) {
      // version is a CID Uint8Array
      const cid = bytes
      return {
          version: v,
          codec: multicodec.getCodec(cid.slice(1)),
          multihash: multicodec.rmPrefix(cid.slice(1)),
          multibaseName: 'base32'
      } 
    } else {
      // version is a raw multihash Uint8Array, so v0
      return {
        version: 0,
        codec: 'dag-pb',
        multihash: bytes,
        multibaseName: 'base58btc'
        } 
    }   
}

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
                    //console.log(message.toObject())
                    // process each request
                    console.log('---requests---')
                    message.getRequestsList().forEach(request => {
                        const root = new CID(request.getRoot())
                        console.log('root=', root)
                        const selector = dagCBOR.util.deserialize(request.getSelector())
                        console.log('selector=', selector)
                    })
                    // process each response
                    console.log('---responses---')
                    message.getResponsesList().forEach(response => {
                        console.log('id=', response.getId())  
                        console.log('status=', response.getStatus())  
                        const extensionsMap = response.getExtensionsMap()
                        for (let key of extensionsMap.keys()) {
                            console.log(key, '=', extensionsMap.get(key).length, 'bytes')
                        }
                    })
                    // process each block
                    console.log('---data---')
                    message.getDataList().forEach(data => {
                        const prefix = prefixFromBytes(data.getPrefix())
                        console.log('prefix=', prefix)
                        console.log('data=', data.getData().length, 'bytes')
                        /*
                        // TODO: this fails with Error: Do not have multiformat entry for "dag-pb" and
                        // i am not sure how to fix this yet
                        const block = Block.decoder(data.getData(), prefix.codec)
                        console.log(block)
                        console.log('decoded=',block.decode())
                        */
                    })
                }
            }
        )
    })

    // Start the dialer libp2p node
    await node.start()

    // Dial the responder node
    //const responderMultiAddr = '/ip4/127.0.0.1/tcp/4001/p2p/QmYHHiqxheZ8KxFtChi7YS8Mr5J8YL12SQYhaeApkkr2mD' // go-ipfs
    const responderMultiAddr = '/ip4/127.0.0.1/tcp/10333/p2p/QmcrQZ6RJdpYuGvZqD5QEHAv6qX4BrQLJLQPQUrTrzdcgm' // js responder
    console.log('Dialing to peer:', responderMultiAddr)
    const { stream } = await node.dialProtocol(responderMultiAddr, '/ipfs/graphsync/1.0.0')

    console.log('dialed responder on protocol: /ipfs/graphsync/1.0.0')

    const requestMessage = new messages.Message.Request()
    requestMessage.setId(0)
    requestMessage.setRoot(new CID('Qme98eG7WKx6VEqf3Jza7rp9CRXgSHD7o8SL5KoDggH2VX').bytes)
    requestMessage.setSelector(dagCBOR.util.serialize({
        "a": {
            ">": {
                ".": {}
            }
        }
    }))
    requestMessage.setPriority(0)
    requestMessage.setCancel(false)
    requestMessage.setUpdate(false)
    const message = new messages.Message()
    message.setCompleterequestlist(true)
    message.addRequests(requestMessage)
    const bytes = message.serializeBinary();

    await pipe(
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

