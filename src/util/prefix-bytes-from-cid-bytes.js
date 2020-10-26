const CID = require('cids')


const prefixBytesFromCIDBytes = (bytes) => {
    // TODO: update this to use new CID from multiformats?
    const cid = new CID(bytes)
    return cid.prefix
}

module.exports = prefixBytesFromCIDBytes