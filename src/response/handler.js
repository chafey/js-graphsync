const isTerminalStatus = require("../util/is-terminal-status")
const codecFromPrefixBytes = require('../util/codec-from-prefix-bytes')
const dagCBOR = require('ipld-dag-cbor')

const dumpExtensions = (extensions) => {
    console.log("extensions:")
    for(const extension in extensions) {
        if(extension == 'graphsync/response-metadata') {
            console.log('graphsync/response-metadata=', dagCBOR.util.deserialize(extensions[extension]))
        } else {
            console.log(extension)
        }
    }
}

const debug = (response, data) => {
    console.log('response.id=', response.id)
    console.log('response.status=', response.status)
    dumpExtensions(response.extensions)
    console.log('data.length=', data.length)
}

const createResponseHandler = (Block, blockStore) => {
    return async (requestProxy, requestMutator, response, data) => {
        // ignore any responses if we have already reached the terminal status
        if(isTerminalStatus(requestProxy.status().status)) {
            // TODO: Log warning?
            //console.warn('ignoring response for request that has already completed')
            return
        }

        //debug(response, data)

        // process each block
        for(const blockData of data) {
            // get the codec from the prefix
            const codec = codecFromPrefixBytes(blockData.prefix)

            // create a block from the raw data
            const block = await Block.decoder(blockData.data, codec)

            // TODO: validate block

            // store block in block store
            await blockStore.put(block)

            // update block stats
            requestMutator.updateBlockStats(blockData)
        }

        // update the request status (will also resolve the completed promise if this makes the request completed)
        requestMutator.setStatus(response.status)
    }
}

module.exports = createResponseHandler