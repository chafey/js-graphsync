const CID = require('cids')
const dagCBOR = require('ipld-dag-cbor')
const exchangeManager = require('./exchange-manager')
const multiaddr = require('multiaddr')

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
        const blocks = []
        exchange.sendResponse(request.id, blocks)
    })
}

module.exports = requestProcessor