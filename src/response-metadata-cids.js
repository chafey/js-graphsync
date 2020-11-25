const { decode } = require('@ipld/dag-cbor')

/**
 * Returns an array of CIDs based on the response metadata in the responses
 * for a graphsync message
 * @param {*} message 
 */

const responseMetaDataCIDs = (message) => {

    return message.responses.filter(response => response.extensions['graphsync/response-metadata'])
        .map(response => decode(response.extensions['graphsync/response-metadata']))
        .reduce((a,b) => a.concat(b), [])
        .filter(metaDataBlock => metaDataBlock.blockPresent)
        .map(metaDataBlock => metaDataBlock.link)
}

module.exports = responseMetaDataCIDs