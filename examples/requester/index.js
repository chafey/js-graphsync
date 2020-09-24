const Libp2p = require('libp2p')
const TCP = require('libp2p-tcp')
const { NOISE } = require('libp2p-noise')
const MPLEX = require('libp2p-mplex')
const pipe = require('it-pipe')

main = async () => {
    const node = await Libp2p.create({
        modules: {
            transport: [TCP],
            connEncryption: [NOISE],
            streamMuxer: [MPLEX]
        }
    })

    // Start the dialer libp2p node
    await node.start()

    // Dial the responder node
    const responderMultiAddr = '/ip4/127.0.0.1/tcp/10333/p2p/QmcrQZ6RJdpYuGvZqD5QEHAv6qX4BrQLJLQPQUrTrzdcgm'
    console.log('Dialing to peer:', responderMultiAddr)
    const { stream } = await node.dialProtocol(responderMultiAddr, '/ipfs/graphsync/1.0.0')

    console.log('dialed responder on protocol: /ipfs/graphsync/1.0.0')

    pipe(
        ['test data'],
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

