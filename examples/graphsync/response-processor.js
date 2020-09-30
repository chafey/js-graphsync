const prefixFromBytes = require('./prefix-from-bytes')
const exchangeManager = require('./exchange-manager')

// TODO: Block to be dependency injected into library, codecs will be library consumers responsibility
const Block = require('@ipld/block/defaults')
const dagPB = require('../../extern/js-dag-pb/dist/cjs/index.js')
Block.multiformats.add(dagPB)

const responseProcessor = async (message, stream, connection) => {
    const requests = []
    const exchange = await exchangeManager.getForPeer(connection.remotePeer)
    message.responses.forEach((response, index) => {
        console.log('response #',index)
        console.log(' id =', response.id)
        console.log(' status =', response.status)
        const request = exchange.getRequest(response.id)
        if(!request) {
            console.warn('could not find request referenced by response!')
            // TODO: figure out what to do here...
        } else {
            requests.push(request)
        }
    })

    message.data.forEach((data, index) => {
        console.log('block #',index)
        console.log(' prefix=', data.prefix)
        const prefix = prefixFromBytes(data.prefix)
        console.log(' prefix =', prefix)
        console.log(' data.length =', data.data.length)

        // TODO: create block from data and decode
        //const block = Block.decoder(data.data, prefix.codec)
        //console.log(block)
        //console.log('decoded=',block.decode())

        // TODO: pass decoded block to request validator in the list of requests
        // TODO: if block is valid, store in block store
    })
}

module.exports = responseProcessor