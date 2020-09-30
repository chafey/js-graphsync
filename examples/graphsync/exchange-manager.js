
const Exchange = require('./exchange')

const peerToExchangeMap = []

const peerConnected = async(peer, node) => {
    const peerId = peer.toB58String()
    if(!peerToExchangeMap[peerId]) {
        peerToExchangeMap[peerId] = {
            node
        }
    } else {
        console.warn('peer connected, but already present in peerToExchangeMap!')
    }
}

const peerDisconnected = async(peer, node) => {
    const peerId = peer.toB58String()
    if(!peerToExchangeMap[peerId]) {
        console.warn('peer disconnected but no entry in peerToExchangeMap!')
    } else {
        delete peerToExchangeMap[peerId]
    }
}

const getForPeer = async (peer) => {
    const peerId = peer.toB58String()
    const entry = peerToExchangeMap[peerId]
    if(!entry) {
        console.warn('unable to find peer ', peer, ' in peerToExchangeMap!')
    } else {
        if(!entry.exchange) {
            entry.exchange = await Exchange.create(entry.node, peer)
        }
        return entry.exchange
    }
}

module.exports = {
    peerConnected,
    peerDisconnected,
    getForPeer
}