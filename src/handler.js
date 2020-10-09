const lp = require('it-length-prefixed')
const { pipe } = require('it-pipe')
const graphsyncMessage = require('./message/graphsync-message')


const createHandler = async(node, peerManager) => {
    const newStreamHandler = async({connection, stream, protocol}) => {
        const peerId = connection.remotePeer.toB58String()
        //console.log('new graphsync stream from ', peerId)
        const peer = await peerManager.getOrCreatePeer(peerId)
        peer.inboundStreams.push(stream)
        //console.log('peer=', peer)

        pipe(
            stream,
            lp.decode(),
            async function (source) {
                for await (const data of source) {
                    //console.log('received graphsync message of length ',data.length)
                    const message = await graphsyncMessage.Message.decode(data.slice())
                    //console.log(message)
                    //await requestProcessor(message, stream, connection)
                    // await responseProcessor(message, stream, connection)
                }
            }
        )
    }

    node.handle('/ipfs/graphsync/1.0.0', newStreamHandler)
}

module.exports = createHandler