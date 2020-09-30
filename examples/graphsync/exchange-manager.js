const peerToExchangeMap = []

const getForPeer = (peer) => {
    const peerId = peer.toB58String()
    if(!peerToExchangeMap[peerId]) {
        peerToExchangeMap[peerId] = {
            requests: {}
        }
    }
    return peerToExchangeMap[peerId]
}

module.exports = {
    getForPeer
}