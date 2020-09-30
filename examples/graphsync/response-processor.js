const prefixFromBytes = require('./prefix-from-bytes')

const responseProcessor = (message, stream, connection, requests, blockStore) => {
    message.responses.forEach((response, index) => {
        console.log('response #',index)
        console.log(' id =', response.id)
        console.log(' status =', response.status)
        // TODO: get list of requests associated with the response id
    })

    message.data.forEach((data, index) => {
        console.log('block #',index)
        const prefix = prefixFromBytes(data.prefix)
        console.log(' prefix =', prefix)
        console.log(' data =', data.data)

        // TODO: create block from data and decode
        // TODO: pass decoded block to request validator in the list of requests
        // TODO: if block is valid, store in block store
    })
}

module.exports = responseProcessor