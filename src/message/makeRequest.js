const messages = require('./pb/message_pb');
const dagCBOR = require('ipld-dag-cbor')


const makeRequest = async(root, selector) => {
    const requestMessage = new messages.Message.Request()
    requestMessage.setId(100)
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
    return bytes
}

module.exports = makeRequest