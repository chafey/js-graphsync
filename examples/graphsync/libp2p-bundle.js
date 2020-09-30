'use strict'

const TCP = require('libp2p-tcp')
const mplex = require('libp2p-mplex')
const SECIO = require('libp2p-secio')
const { NOISE } = require('libp2p-noise')
const defaultsDeep = require('@nodeutils/defaults-deep')
const libp2p = require('libp2p')

class Node extends libp2p {
  constructor (_options) {
    const defaults = {
      modules: {
        transport: [
          TCP
        ],
        streamMuxer: [ mplex ],
        connEncryption: [ NOISE, SECIO ]
      }
    }

    super(defaultsDeep(_options, defaults))
  }
}

module.exports = Node
