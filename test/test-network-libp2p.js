const network = require('../src/network')
const Libp2p = require('libp2p')
const TCP = require('libp2p-tcp')
const assert = require('assert')

const createNode = async () => {
    const node = await Libp2p.create({
        addresses: {
          listen: ['/ip4/127.0.0.1/tcp/8000']
        },
        modules: {
          transport: [WebSockets],
          connEncryption: [NOISE],
          streamMuxer: [MPLEX]
        }
      })
      return node
}
/*
describe('Network libp2p', () => {
    it('newFromLibp2pHost succeeds', async () => {
        const node = createNode()
        const host = '/ip4/127.0.0.1/tcp/8080'
        const libp2pNetwork = network.libp2p.newFromLibp2pHost(node, host)
        console.log(libp2pNetwork)
    })
})*/