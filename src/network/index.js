const Libp2p = require('libp2p')

const create = (node, libp2p = Libp2p) => {

    return {
        connect: async (responderMultiAddr) => {
            const { stream } = await node.dialProtocol(responderMultiAddr, '/ipfs/graphsync/1.0.0')

        }
    }
}


module.exports = create
