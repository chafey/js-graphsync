const Libp2p = require('libp2p')
const TCP = require('libp2p-tcp')
const multiaddr = require('multiaddr')
const { NOISE } = require('libp2p-noise')
const MPLEX = require('libp2p-mplex')


/**
 * Creates a Libp2p node that is compatible with an address that go-ipfs is
 * listening on for graphysync requests.  By default it does not listen for
 * inbound connections, but an array of multiaddr to listen on can be passed
 * in if desired, e.g.
 * 
 * createIpfsTCPNode(['/ip4/127.0.0.1/tcp/8000'])
 * 
 * @param {*} multiaddr 
 */

const createIpfsTCPNode = async (listen = []) => {
    return Libp2p.create({
        addresses: {
          listen
        },
        modules: {
          transport: [TCP],
          connEncryption: [NOISE],
          streamMuxer: [MPLEX]
        }
      })
}
 

module.exports = createIpfsTCPNode