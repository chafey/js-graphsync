'use strict'
/* eslint-disable no-console */

/*
 * Dialer Node
 */

const multiaddr = require('multiaddr')
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
  const [dialerId, listenerId] = await Promise.all([
    PeerId.createFromJSON(require('./id-d')),
    PeerId.createFromJSON(require('./id-l'))
  ])

  // Dialer
  const dialerNode = new Node({
    addresses: {
    },
    peerId: dialerId
  })

  initializeNode(dialerNode)



  // Add peer to Dial (the listener) into the PeerStore
  const listenerMultiaddr = '/ip4/127.0.0.1/tcp/10333/p2p/' + listenerId.toB58String()

  // Start the dialer libp2p node
  await dialerNode.start()

  console.log('Dialer ready, listening on:')
  dialerNode.multiaddrs.forEach((ma) => console.log(ma.toString() +
        '/p2p/' + dialerId.toB58String()))

  // Dial the listener node
  console.log('Dialing to peer:', listenerMultiaddr)

  try {
    const result = await dialerNode.dialProtocol(listenerMultiaddr, '/echo/1.0.0')
    const stream = result.stream
  
    console.log('nodeA dialed to nodeB on protocol: /echo/1.0.0')
  
  
    await pipe(
      // Source data
      ['hey'],
      // Write to the stream, and pass its output to the next function
      stream,
      // Sink function
      async function (source) {
        // For each chunk of data
        for await (const data of source) {
          // Output the data
          console.log('received echo:', data.toString())
        }
      }
    )
    console.log('pipe done')
      console.log(stream)
  } catch(err) {
      console.log('err=', err)
      console.log('err.name=', err.name)
      console.log('err.message=', err.message)
      console.log('err.errors=', err.errors)
  }

}

run()
