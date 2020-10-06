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

  if(process.argv.length < 4) {
    console.log("missing  arguments - expecting graphsync responder multiaddr and root CID")
    process.exit(-1)
  }

  const [idDialer] = await Promise.all([
    PeerId.createFromJSON(require('./peer-id-dialer'))
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
  const listenerMa = multiaddr(process.argv[2])
  //console.log(listenerMa)
  const peerId = PeerId.createFromB58String(listenerMa.getPeerId())
  //console.log('peerId=',  peerId)
  nodeDialer.peerStore.addressBook.set(peerId, [listenerMa])

  console.log('Dialer dialed to listener on protocol: /ipfs/graphsync/1.0.0')

  // create a graphsync exchange with the responder 
  const exchange = await Exchange.create(nodeDialer, peerId)
  exchangeManager.addExchange(exchange, listenerMa.getPeerId(), nodeDialer)

  // issue the graphsync request to the responder
  const root = new CID(process.argv[3])
  const selector = selectors.all
  exchange.sendRequest(root, selector)
}

run()
