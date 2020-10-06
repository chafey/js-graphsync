const { pipe } = require('it-pipe')
const lp = require('it-length-prefixed')
const graphsyncMessage = require('../../src/message/graphsync-message')
const requestProcessor = require('./request-processor')
const responseProcessor = require('./response-processor')

handler = async({connection, stream, protocol}) => {
    console.log('new graphsync stream from ', connection.remotePeer.toB58String())

    //console.log('connection:', connection)
    //const exchange = await exchangeManager.getForPeer(connection.remotePeer)

    pipe(
        stream.source,
        lp.decode(),
        async function (source) {
            for await (const data of source) {
                console.log('received graphsync message of length ',data.length)
                const message = await graphsyncMessage.Message.decode(data.slice())
                await requestProcessor(message, stream, connection)
                await responseProcessor(message, stream, connection)
            }
        }
    )
}

module.exports = handler