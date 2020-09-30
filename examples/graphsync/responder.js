'use strict'
/* eslint-disable no-console */

const multaddr = require('multiaddr')
const PeerId = require('peer-id')
const Node = require('./libp2p-bundle.js')
const lp = require('it-length-prefixed')
const { pipe } = require('it-pipe')
const { console } = require('ipfs-utils/src/globalthis')
const pushable = require('it-pushable')
const CID = require('cids')
const dagCBOR = require('ipld-dag-cbor')
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

  /*async ({ stream }) => {
    const sink = pushable()

    pipe(
        stream.source,
        lp.decode(),
        async function (source) {
            for await (const msg of source) {
                console.log('received message of length ',msg.length)
                const message = await messages.Message.decode(msg.slice())
                //console.log(message)

                // process each request
                message.requests.forEach((request) => {
                    console.log('request=',request)
                    console.log('id=', request.id)
                    const root = new CID(request.root)
                    console.log('root=', root)
                    const selector = dagCBOR.util.deserialize(request.selector)
                    console.log('selector=', selector)
                    console.log('priority=', request.getPriority())

                    const bytes = messages.Message.encode({
                        completeRequestList: true,
                        responses: [
                            {
                                id: request.id,
                                status: 20,// request completed, full content
                            }
                        ]
                    })
                
                    console.log('sending response message of length ', bytes.length)
                    sink.push(bytes)
                })
            }
        }
    )

    pipe(
        sink,
        lp.encode(),
        stream.sink
        )
  })
        */

  // Start listening
  await nodeListener.start()

  // Output listen addresses to the console
  console.log('Listener ready, listening on:')
  nodeListener.multiaddrs.forEach((ma) => {
    console.log(ma.toString() + '/p2p/' + idListener.toB58String())
  })
}

run()
