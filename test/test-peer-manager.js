const createPeerManager = require('../src/peer-manager')
const assert = require('assert')

describe('PeerManager', () => {
    it('creation returns object', async () => {
        const mockNode = {
            dialProtocol: async(peerId, protocols) => {
                return {stream:{}}
            }
        }
        const peerManager = createPeerManager(mockNode)         
        assert.ok(peerManager, "failed to create peerManager")
    })

    it('getOrCreatePeer returns peer', async () => {
        const mockNode = {
            dialProtocol: async(peerId, protocols) => {
                return {stream:{}}
            }
        }
        const peerManager = createPeerManager(mockNode)         
        const peer = await peerManager.getOrCreatePeer('QmcrQZ6RJdpYuGvZqD5QEHAv6qX4BrQLJLQPQUrTrzdcgm')
        assert.ok(peer, "failed to create peer")
    })

    it('getOrCreatePeer creates and dials peer if not found', async () => {
        const dialedPeerIds = []
        const mockNode = {
            dialProtocol: async(peerId, protocols) => {
                dialedPeerIds.push(peerId)
                return {stream:{}}
            }
        }
        const peerManager = createPeerManager(mockNode)         
        const peer = await peerManager.getOrCreatePeer('QmcrQZ6RJdpYuGvZqD5QEHAv6qX4BrQLJLQPQUrTrzdcgm')
        assert.strictEqual(dialedPeerIds.length, 1)
        assert.strictEqual(dialedPeerIds[0], 'QmcrQZ6RJdpYuGvZqD5QEHAv6qX4BrQLJLQPQUrTrzdcgm')
    })

    it('getOrCreatePeer returns existing peer', async () => {
        const dialedPeerIds = []
        const mockNode = {
            dialProtocol: async(peerId, protocols) => {
                dialedPeerIds.push(peerId)
                return {stream:{}}
            }
        }
        const peerManager = createPeerManager(mockNode)         
        const newPeer = await peerManager.getOrCreatePeer('QmcrQZ6RJdpYuGvZqD5QEHAv6qX4BrQLJLQPQUrTrzdcgm')
        const existingPeer = await peerManager.getOrCreatePeer('QmcrQZ6RJdpYuGvZqD5QEHAv6qX4BrQLJLQPQUrTrzdcgm')
        assert.strictEqual(dialedPeerIds.length, 1)
        assert.strictEqual(dialedPeerIds[0], 'QmcrQZ6RJdpYuGvZqD5QEHAv6qX4BrQLJLQPQUrTrzdcgm')
        assert.strictEqual(newPeer, existingPeer)
    })

    it('getOrCreatePeer while already dialing peer returns the same stream', async () => {
        const dialedPeerIds = []
        const mockNode = {
            dialProtocol: async(peerId, protocols) => {
                dialedPeerIds.push(peerId)
                return {stream:{}}
            }
        }
        const peerManager = createPeerManager(mockNode)         
        const newPeer = peerManager.getOrCreatePeer('QmcrQZ6RJdpYuGvZqD5QEHAv6qX4BrQLJLQPQUrTrzdcgm')
        const existingPeer = peerManager.getOrCreatePeer('QmcrQZ6RJdpYuGvZqD5QEHAv6qX4BrQLJLQPQUrTrzdcgm')
        await newPeer
        await existingPeer
        assert.strictEqual(dialedPeerIds.length, 1)
        assert.strictEqual(dialedPeerIds[0], 'QmcrQZ6RJdpYuGvZqD5QEHAv6qX4BrQLJLQPQUrTrzdcgm')
        assert.strictEqual(await newPeer, await existingPeer)
    })

    it('getOrCreatePeer rejects promise if dialProtocol throws', async () => {
        const mockNode = {
            dialProtocol: async(peerId, protocols) => {
                throw new Error("Whoops!");
            }
        }
        const peerManager = createPeerManager(mockNode)         
        assert.rejects(peerManager.getOrCreatePeer('QmcrQZ6RJdpYuGvZqD5QEHAv6qX4BrQLJLQPQUrTrzdcgm'))
    })
})