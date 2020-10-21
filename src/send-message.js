const lp = require('it-length-prefixed')
const { pipe } = require('it-pipe')
const graphsyncMessage = require('./message/graphsync-message')

/**
 * Sends a graphsync message to a peer
 * Returns resolved promise on success, rejected promise on failure
 * @param {*} node 
 * @param {*} peerId 
 * @param {*} message 
 */

const sendMessage = async(node, peerId, message) => {

    const {stream} = await node.dialProtocol(peerId, '/ipfs/graphsync/1.0.0')

    // TODO: explore what happens with invalid graphsync messages

    const bytes = graphsyncMessage.Message.encode(message)

    await pipe([bytes],
        lp.encode(),
        stream)
}

module.exports = sendMessage