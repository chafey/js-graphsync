const createBlockBuffer = require('./block-buffer')

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
