const { decode } = require('@ipld/dag-cbor')

const dumpExtensions = (extensions) => {
    console.log(" extensions:")
    for(const extension in extensions) {
        if(extension == 'graphsync/response-metadata') {
            console.log('  graphsync/response-metadata=', decode(extensions[extension]))
        } else {
            console.log(' ', extension)
        }
    }
}

const createDebugMessageHandler = () => {

    return async (peerIdAsString, message) => {
        console.log('message from peerId', peerIdAsString)
        console.log('# responses = ', message.responses.length)
        for await(response of message.responses) {
            console.log(' response.id=', response.id)
            console.log(' response.status=', response.status)
            dumpExtensions(response.extensions)
        }
        console.log('# blocks = ', message.data.length)
        console.log('# requests = ', message.requests.length)
    }
}

module.exports = createDebugMessageHandler