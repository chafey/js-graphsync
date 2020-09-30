const CID = require('cids')
const dagCBOR = require('ipld-dag-cbor')
const exchangeManager = require('./exchange-manager')
const Block = require('@ipld/block/defaults')
prefixBytesFromCID = require('./prefix-bytes-from-cid')

const requestProcessor = async (message, stream, connection) => {
    message.requests.forEach(async (request, index) => {
        console.log('request #', index)
        console.log(' id =', request.id)
        const root = new CID(request.root)
        console.log(' root =', root)
        const selector = dagCBOR.util.deserialize(request.selector)
        console.log(' selector =', selector)
        console.log(' priority =', request.getPriority())
    
        const exchange = await exchangeManager.getForPeer(connection.remotePeer)
        
        const hello = {"hello": "world"}
        const serialized = dagCBOR.util.serialize(hello)
        const cid = await dagCBOR.util.cid(serialized)
        console.log('cid=', cid)
        const prefix = prefixBytesFromCID(cid)
        console.log('prefix=', prefix)
        console.log('data.length=', serialized.length)
        const blocks = [{
            prefix: prefix,
            data: serialized
        }]
        exchange.sendResponse(request.id, blocks)
    })
}

module.exports = requestProcessor