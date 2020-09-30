'use strict'
/* eslint-disable no-console */

const PeerId = require('peer-id')
const multiaddr = require('multiaddr')
const Node = require('./libp2p-bundle')
const CID = require('cids')
const initializeNode = require('./initialize-node')
const selectors = require('./selectors')
const Exchange = require('./exchange')
const exchangeManager = require('./exchange-manager')

async function run() {
  const [idDialer, idListener] = await Promise.all([
    PeerId.createFromJSON(require('./peer-id-dialer')),
    PeerId.createFromJSON(require('./peer-id-listener'))
  ])

  // Create a new libp2p node on localhost with a randomly chosen port
  const nodeDialer = new Node({
    peerId: idDialer,
    addresses: {
      listen: ['/ip4/0.0.0.0/tcp/0']
    }
  })

  // initialize this libp2p node to handle graphsync protocol
  await initializeNode(nodeDialer)

  // Start the libp2p host
  await nodeDialer.start()

  // Output this node's address
  console.log('Dialer ready, listening on:')
  nodeDialer.multiaddrs.forEach((ma) => {
    console.log(ma.toString() + '/p2p/' + idDialer.toB58String())
  })

  // Dial to the remote peer (the "listener")
  const listenerMa = multiaddr('/ip4/127.0.0.1/tcp/4001/p2p/QmSn6pxaiWdParNqMH2uomzEvD6pPRRJrzxHqQsbEihDNd') // go-ipfs
  //const listenerMa = multiaddr(`/ip4/127.0.0.1/tcp/10333/p2p/${idListener.toB58String()}`)

  console.log('Dialer dialed to listener on protocol: /ipfs/graphsync/1.0.0')

  const exchange = await Exchange.create(nodeDialer, listenerMa)
  exchangeManager.addExchange(exchange, idListener)

  const root = new CID('Qme98eG7WKx6VEqf3Jza7rp9CRXgSHD7o8SL5KoDggH2VX')
  const selector = selectors.all
  exchange.sendRequest(root, selector)
}

run()
