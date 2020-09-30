'use strict'
/* eslint-disable no-console */

const PeerId = require('peer-id')
const Node = require('./libp2p-bundle.js')
const { console } = require('ipfs-utils/src/globalthis')
const initializeNode = require('./initialize-node')

async function run() {
  // Create a new libp2p node with the given multi-address
  const idListener = await PeerId.createFromJSON(require('./peer-id-listener'))
  const nodeListener = new Node({
    peerId: idListener,
    addresses: {
      listen: ['/ip4/0.0.0.0/tcp/10333']
    }
  })

  await initializeNode(nodeListener)

  // Start listening
  await nodeListener.start()

  // Output listen addresses to the console
  console.log('Listener ready, listening on:')
  nodeListener.multiaddrs.forEach((ma) => {
    console.log(ma.toString() + '/p2p/' + idListener.toB58String())
  })
}

run()
