const makeRequest = require('./message/makeRequest')
const newGraphExchange = require('./graph-exchange')

const init = () => {
    console.log("Initializing...")
}

const request = async (context, root, selector) => {
 
    const bytes = makeRequest(root, selector)
    console.log(bytes.length)

    // TODO: create handler for messages sent by responder
    // TODO: send request message to responder over network
    // return progress object
    return {
        complete: async () => { }
    }
}

module.exports = {
    init,
    new: newGraphExchange,
}