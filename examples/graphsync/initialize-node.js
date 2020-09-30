const streamHandler = require('./stream-handler')
const exchangeManager = require('./exchange-manager')

const initializeNode = async (node) => {
    // Log a message when a remote peer connects to us
    node.connectionManager.on('peer:connect', async (connection) => {
        //console.log(connection)
        console.log(`${connection.id} ${connection._stat.direction} connect with peer ${connection.remotePeer.toB58String()}`)
        await exchangeManager.peerConnected(connection.remotePeer, node)
    })

    node.connectionManager.on('peer:disconnect', async (connection) => {
        //console.log(connection)
        console.log(`${connection.id} ${connection._stat.direction} disconnect with peer ${connection.remotePeer.toB58String()}`)
        await exchangeManager.peerDisconnected(connection.remotePeer, node)
    })

    await node.handle('/ipfs/graphsync/1.0.0', streamHandler)
}

module.exports = initializeNode