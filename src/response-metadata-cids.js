const { decode } = require('@ipld/dag-cbor')

const responseMetaDataCIDs = (message) => {

    return message.responses.filter(response => response.extensions['graphsync/response-metadata'])
        .map(response => decode(response.extensions['graphsync/response-metadata']))
        .reduce((a,b) => a.concat(b), [])
        .filter(metaDataBlock => metaDataBlock.blockPresent)
        .map(metaDataBlock => metaDataBlock.link)
}

module.exports = responseMetaDataCIDs