const Libp2p = require('libp2p')
const TCP = require('libp2p-tcp')
const multiaddr = require('multiaddr')
const createIpfsTCPNode = require('./create-ipfs-tcp-node')

newFromLibp2pHost = (node, host) => {



    sendMessage = (context, peerId, message) => {


    }

    return {
        sendMessage,

    }

}

newTCPNode = async (multiaddr = '/ip4/127.0.0.1/tcp/8000') => {
    const node = await Libp2p.create({
        addresses: {
          listen: [multiaddr]
        },
        modules: {
          transport: [WebSockets],
          connEncryption: [NOISE],
          streamMuxer: [MPLEX]
        }
      })
    return node
}

module.exports = {
    newFromLibp2pHost,
    newTCPNode,
    createIpfsTCPNode
}