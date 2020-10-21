'use strict'
/* eslint-disable no-console */

/*
 * Listener Node
 */

const PeerId = require('peer-id')
const Node = require('./libp2p-bundle')
const pipe = require('it-pipe')

const initializeNode = (node) => {
    // Log a message when a remote peer connects to us
    node.connectionManager.on('peer:connect', async (connection) => {
        //console.log(connection)
        console.log(`${connection.id} ${connection._stat.direction} connect with peer ${connection.remotePeer.toB58String()}`)
    })

    node.connectionManager.on('peer:disconnect', async (connection) => {
        //console.log(connection)
        console.log(`${connection.id} ${connection._stat.direction} disconnect with peer ${connection.remotePeer.toB58String()}`)
    })
}


async function run() {
  const listenerId = await PeerId.createFromJSON(require('./id-l'))

  // Listener libp2p node
  const listenerNode = new Node({
    addresses: {
      listen: ['/ip4/0.0.0.0/tcp/10333']
    },
    peerId: listenerId
  })

  initializeNode(listenerNode)

  // Handle incoming connections for the protocol by piping from the stream
  // back to itself (an echo)
  await listenerNode.handle('/echo/1.0.0', async(inc) => {
    console.log("echo handler")
    //console.log(inc)
    const stream=inc.stream
    await pipe(stream.source, stream.sink)
    //console.log('sent response, closing stream')
    //console.log(stream)
    await stream.close()
    //await inc.connection.close()
})

  // Start listening
  await listenerNode.start()

  console.log('Listener ready, listening on:')
  listenerNode.multiaddrs.forEach((ma) => {
    console.log(ma.toString() + '/p2p/' + listenerId.toB58String())
  })
}

run()
