const lp = require('it-length-prefixed')
const { pipe } = require('it-pipe')
const graphsyncMessage = require('./message/graphsync-message')

const createHandler = (messageHandler) => {
    return async({connection, stream, protocol}) => {
        const peerId = connection.remotePeer.toB58String()
        //console.log('new graphsync stream from ', peerId)

        return pipe(
            stream,
            lp.decode(),
            async function (source) {
                for await (const data of source) {
                    //console.log('received graphsync message of length ',data.length)
                    const message = await graphsyncMessage.Message.decode(data.slice())
                    messageHandler(peerId, message)
                }
            }
        )
    }
}

module.exports = createHandler