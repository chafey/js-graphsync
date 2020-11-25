const createBlockBuffer = require('./block-buffer')

/**
 * Returns an object which manages a map of peers.  All peer related graphsync information
 * is stored in this object.
 */

const createPeerMap = () => {
    const peerMap = {}
    
    const getOrCreate = (peerIdAsString) => {
        if(!peerMap[peerIdAsString]) {
            console.log('creating peer for', peerIdAsString)
            peerMap[peerIdAsString] = {
                nextRequestId: 0,
                blockBuffer : createBlockBuffer(),
                requests: {}
            }
        }
        return peerMap[peerIdAsString]
    }
    
    return {
        getOrCreate
    }
}

module.exports = createPeerMap
