const sendMessage = require('../src/send-message')
const assert = require('assert')

const responderPeerId = 'QmcrQZ6RJdpYuGvZqD5QEHAv6qX4BrQLJLQPQUrTrzdcgm'

// nothing is required, so an empty object is technically valid...
const emptyGraphSyncMessage = {}

describe('sendMessage', () => {
    it('succeeds', async () => {
        const dialedPeerIds = []
        const sentData = []
        const mockNode = {
            dialProtocol: async(peerId, protocols) => {
                dialedPeerIds.push(peerId)
                return {
                    stream : async(source) => {
                        for await (const data of source) {
                            sentData.push(data)
                        }
                    }
                }            
            }
        }

        await sendMessage(mockNode, responderPeerId, emptyGraphSyncMessage)
        assert.strictEqual(dialedPeerIds.length, 1)
        assert.strictEqual(sentData.length, 1)
        assert.strictEqual(sentData[0].length, 1)
    })

    it('rejects on failed dialProtocol', async () => {
        const mockNode = {
            dialProtocol: async(peerId, protocols) => {
                return Promise.reject(new Error('failed to connect'))
            }
        }

        assert.rejects(sendMessage(mockNode, responderPeerId, emptyGraphSyncMessage))
    })

    it('rejects on write stream failure', async () => {
        const mockNode = {
            dialProtocol: async(peerId, protocols) => {
                return {
                    stream : async(source) => {
                        return Promise.reject(new Error('failed to write to stream'))
                    }
                }            
            }
        }

        assert.rejects(sendMessage(mockNode, responderPeerId, emptyGraphSyncMessage))
    })
})
