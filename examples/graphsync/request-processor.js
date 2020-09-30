const CID = require('cids')
const dagCBOR = require('ipld-dag-cbor')

const requestProcessor = (message) => {
    message.requests.forEach((request, index) => {
        console.log('request #', index)
        console.log(' id =', request.id)
        const root = new CID(request.root)
        console.log(' root =', root)
        const selector = dagCBOR.util.deserialize(request.selector)
        console.log(' selector =', selector)
        console.log(' priority =', request.getPriority())
    
    

        /*
        const bytes = messages.Message.encode({
            completeRequestList: true,
            responses: [
                {
                    id: request.id,
                    status: 20,// request completed, full content
                }
            ]
        })
    
        console.log('sending response message of length ', bytes.length)
        sink.push(bytes)
        */
    
    })
}

module.exports = requestProcessor