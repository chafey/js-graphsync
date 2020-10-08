const createIpfsTCPNode = require('../../helpers/create-ipfs-tcp-node')
const assert = require('assert')

/*
describe('CreateIPFSTcpNode', () => {
    it('create with default parameter succeeds', async () => {
        const listenerNode = await createIpfsTCPNode(['/ip4/127.0.0.1/tcp/7000'])
        //console.log(listenerNode)
        const listenerPeerId = `${listenerNode.addresses.listen[0]}/p2p/${listenerNode.connectionManager._peerId}`
        listenerNode.start()
        console.log('listener node listening on :' + listenerPeerId)

        const dialerNode = await createIpfsTCPNode()
        const connection = await dialerNode.dial(listenerPeerId)
        console.log("connection established")
        console.log(connection.stat)
        console.log(connection)
        connection.close()
        listenerNode.stop()
    })
})
*/
/*
describe('CreateIPFSTcpNode', () => {
    it('connect to go-ipfs', async () => {
        const listenerPeerId = `${listenerNode.addresses.listen[0]}/p2p/${listenerNode.connectionManager._peerId}`
        listenerNode.start()
        console.log('listener node listening on :' + listenerPeerId)

        const dialerNode = await createIpfsTCPNode()
        const connection = await dialerNode.dial(listenerPeerId)
        console.log("connect established")
        console.log(connection.stat)
        connection.close()
        listenerNode.stop()
    })
})*/