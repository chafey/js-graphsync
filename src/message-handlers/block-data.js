const responseMetaDataCIDs = require('../response-metadata-cids')
const generateBlocksFromBlockData = require('../generate-blocks-from-block-data')

const createBlockDataMessageHandler = (getBlockBuffer, Block) => {

    return async (peerIdAsString, message) => {

        // get the blockBuffer for this peer
        const blockBuffer = getBlockBuffer(peerIdAsString)

        // create a set of cids in response metadata
        const cids = new Set(responseMetaDataCIDs(message).map(cid => cid.toString()))

        // iterate over the message data creating blocks
        for await (blockAndCID of generateBlocksFromBlockData(message.data, Block)) {
            // if block was generated and it is in the response metadata
            if(blockAndCID.cid && cids.has(blockAndCID.cid.toString())) {
                // store the block in the blockBuffer
                blockBuffer.put(blockAndCID.cid, blockAndCID.block)
            } 
        }
    }
}

module.exports = createBlockDataMessageHandler