const messages = require('./message/pb/message_pb');
const dagCBOR = require('ipld-dag-cbor')

const init = () => {
    console.log("Initializing...")
}

const request = async (context, root, selector) => {
    // TODO: create request message
    const requestMessage = new messages.Message.Request()
    requestMessage.setId(1)
    requestMessage.setRoot(root.bytes)
    requestMessage.setSelector(dagCBOR.util.serialize(selector))
    requestMessage.setPriority(1)
    requestMessage.setCancel(false)
    requestMessage.setUpdate(false)
    const message = new messages.Message()
    message.setCompleterequestlist(true)
    message.addRequests(requestMessage)
    const bytes = message.serializeBinary();
    //console.log(bytes.length)

    // TODO: create handler for messages sent by responder
    // TODO: send request message to responder over network
    // return progress object
    return {
        complete: async () => { }
    }
}

const newGraphSync = async (network, loader, storer) => {
    return {
        request
    }
}

module.exports = {
    init,
    new: newGraphSync
}