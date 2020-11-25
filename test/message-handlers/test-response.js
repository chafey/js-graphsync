const assert = require('assert')
const createResponseMessageHandler = require('../../src/message-handlers/response')
const createSimpleDAG = require('../fixtures/create-simple-dag')
const createRequestState = require('../../src/request/state')
const createRequestMutator = require('../../src/request/mutator')
const createRequestProxy = require('../../src/request/proxy')
const selectors = require('../../src/selectors')

describe('responseMesssageHandler', async () => {

    let simpleDAG
    const peerId = 'QmcrQZ6RJdpYuGvZqD5QEHAv6qX4BrQLJLQPQUrTrzdcgm'

    const createRequestStateMock = () => {
        const id = 0
        const selector = selectors.depthLimitedGraph
        const validator = Promise.resolve()
    
        return createRequestState(id, peerId, validator, simpleDAG[0].cid, selector)
    }


    before(async() => {
        simpleDAG = await createSimpleDAG()
    })

    it('status is updated with non terminal status for in progress request', async () => {
        // Arrange
        const message = {
            responses: [{
                id: 0,
                status: 10,
            }]
        }
        const state = createRequestStateMock()
        const proxy = createRequestProxy(state)
        const mutator = createRequestMutator(state)
        const messageHandler = createResponseMessageHandler(() => {return mutator})

        // Act
        await messageHandler(peerId, message)

        // Assert
        assert.strictEqual(state.status, 10)
    })

    it('status is not changed for completed request', async () => {
        // Arrange
        const message = {
            responses: [{
                id: 0,
                status: 10,
            }]
        }
        const state = createRequestStateMock()
        const mutator = createRequestMutator(state)
        mutator.setStatus(20)
        const messageHandler = createResponseMessageHandler(() => {return mutator})

        // Act
        await messageHandler(peerId, message)

        // Assert
        assert.strictEqual(state.status, 20)
    })


    it('unknown request is ignored', async () => {
        // Arrange
        const message = {
            responses: [{
                id: 0,
                status: 10,
            }]
        }
        const messageHandler = createResponseMessageHandler(() => {return undefined})

        // Act
        const promise = messageHandler(peerId, message)

        // Assert
        assert.doesNotReject(promise)
    })
})