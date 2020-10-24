const lp = require('it-length-prefixed')
const { pipe } = require('it-pipe')
const graphsyncMessage = require('./message/graphsync-message')

const createHandler = (messageHandler) => {
    return ({connection, stream, protocol}) => {
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
        ).catch((err) => {
            // Silently ignore connection reset messages
            if(err.code !== 'ECONNRESET') {
                // TODO: log this somehow
                console.log(err)
            }
        })
    }
}

module.exports = createHandler