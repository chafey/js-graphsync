const exchangeManager = require('./exchange-manager')
const streamHandler = require('./stream-handler')

const initializeNode = async (node) => {
    // Log a message when a remote peer connects to us
    node.connectionManager.on('peer:connect', (connection) => {
        //console.log(connection)
        console.log(`${connection.id} ${connection._stat.direction} connect with peer ${connection.remotePeer.toB58String()}`)
        exchangeManager.getForPeer(connection.remotePeer)
    })

    node.connectionManager.on('peer:disconnect', (connection) => {
        //console.log(connection)
        console.log(`${connection.id} ${connection._stat.direction} disconnect with peer ${connection.remotePeer.toB58String()}`)
        //exchangeManager.getForPeer(connection.remotePeer)
    })

    await node.handle('/ipfs/graphsync/1.0.0', streamHandler)
}

module.exports = initializeNode