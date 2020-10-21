const createHandler = require('../src/handler')
const graphsyncMessage = require('../src/message/graphsync-message')
const assert = require('assert')
const pushable = require('it-pushable')
const { pipe } = require('it-pipe')
const lp = require('it-length-prefixed')

const createMockMessageHandler = () => {
    const messageHandlerCalls = []
    const messageHandler = (peerId, message) => {
        messageHandlerCalls.push({peerId, message})
    }
    messageHandler.calls = messageHandlerCalls
    return messageHandler
}

const createMockConnection = () => {
    return {
        remotePeer: {
            toB58String: () => "QmcrQZ6RJdpYuGvZqD5QEHAv6qX4BrQLJLQPQUrTrzdcgm"
        }
    }
}

const encodeMessageAndSend = async (message, stream) => {
    const bytes = graphsyncMessage.Message.encode(message)
    // send the message to the requester
    await pipe([bytes],
        lp.encode(),
        async (source) => {
            for await (const data of source) {
                stream.push(data)
            }
        }
    )
}

describe('handler', () => {

    it('decodes empty message', async () => {

        // ARRANGE
        const mockMessageHandler = createMockMessageHandler()
        const handler = createHandler(mockMessageHandler)
        const mockConnection = createMockConnection()
        const mockStream = pushable()
        await encodeMessageAndSend({}, mockStream)
        mockStream.end()

        // ACT
        await handler({
            connection: mockConnection,
            stream: mockStream,
            protocol: '/ipfs/graphsync/1.0.0'
        })

        // ASSERT
        assert.strictEqual(mockMessageHandler.calls.length, 1)
        assert.strictEqual(mockMessageHandler.calls[0].peerId, 'QmcrQZ6RJdpYuGvZqD5QEHAv6qX4BrQLJLQPQUrTrzdcgm')
        assert.strictEqual(mockMessageHandler.calls[0].message.completeRequestList, false)
        assert.strictEqual(mockMessageHandler.calls[0].message.requests.length, 0)
        assert.strictEqual(mockMessageHandler.calls[0].message.responses.length, 0)
        assert.strictEqual(mockMessageHandler.calls[0].message.data.length, 0)
    })
})

