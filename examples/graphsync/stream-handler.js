const { pipe } = require('it-pipe')
const lp = require('it-length-prefixed')
const graphsyncMessage = require('./graphsync-message')
const requestProcessor = require('./request-processor')
const responseProcessor = require('./response-processor')
const exchangeManager = require('./exchange-manager')

handler = async({connection, stream, protocol}) => {
    console.log('new graphsync stream from ', connection.remotePeer.toB58String())

    const exchange = exchangeManager.getForPeer(connection.remotePeer)

    pipe(
        stream.source,
        lp.decode(),
        async function (source) {
            for await (const data of source) {
                console.log('received graphsync message of length ',data.length)
                const message = await graphsyncMessage.Message.decode(data.slice())
                requestProcessor(message)
                responseProcessor(message, exchange.requests)
            }
        }
    )
}

module.exports = handler