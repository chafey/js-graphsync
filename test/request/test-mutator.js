const createRequestState = require('../../src/request/state')
const createRequestMutator = require('../../src/request/mutator')
const selectors = require('../../src/selectors')
const CID = require('cids')

const assert = require('assert')

const peerId = 'QmcrQZ6RJdpYuGvZqD5QEHAv6qX4BrQLJLQPQUrTrzdcgm'
const rootCID = new CID('bafyreidykglsfhoixmivffc5uwhcgshx4j465xwqntbmu43nb2dzqwfvae') // helloWorldBlock CID

const createRequestStateMock = () => {
    const id = 0
    const selector = selectors.depthLimitedGraph
    return createRequestState(id, peerId, rootCID, selector)
}

describe('RequestMutator', () => {

    it('terminal response for in progress request', async () => {
        // Arrange
        const state = createRequestStateMock()
        const requestMutator = createRequestMutator(state)

        // Act
        requestMutator.setStatus(20)
    
        // Assert
        assert.strictEqual(state.status, 20)
        await state.completed // should complete
    })

    it('non terminal response for in progress request', async () => {
        // Arrange
        const state = createRequestStateMock()
        const requestMutator = createRequestMutator(state)

        // Act
        requestMutator.setStatus(10)
    
        // Assert
        promisePending = true
        state.completed.finally(() => {
            promisePending = false
        })
        assert.strictEqual(promisePending, true)
        assert.strictEqual(state.status, 10)
    })

    it('setStatus throws if request is completed', async () => {
        // Arrange
        const state = createRequestStateMock()
        const requestMutator = createRequestMutator(state)
        requestMutator.setStatus(20)

        // Act
        assert.throws(() => requestMutator.setStatus(10))

        // Assert
        assert.strictEqual(state.status, 20)
    })

    it('setStatus rejects for error terminal status', async () => {
        // Arrange
        const state = createRequestStateMock()
        const requestMutator = createRequestMutator(state)

        // Act
        requestMutator.setStatus(30)

        // Assert
        assert.rejects(state.completed, {name: 'GraphsyncStatusError', message: 'Request Rejected. NOT working on it.', status: 30})
        assert.strictEqual(state.status, 30)
    })

    it('updateBlockStatus throws on completed request', async () => {
        // Arrange
        const state = createRequestStateMock()
        const requestMutator = createRequestMutator(state)
        requestMutator.setStatus(20)
        const mockBlockData = {
            data: []
        }

        // Act
        assert.throws(() => requestMutator.updateBlockStats(mockBlockData))

        // Assert
        assert.strictEqual(state.blocksReceived, 0)
        assert.strictEqual(state.bytesReceived, 0)
    })

    it('updateBlockStatus throws on inprogress request', async () => {
        // Arrange
        const state = createRequestStateMock()
        const requestMutator = createRequestMutator(state)
        const mockBlockData = {
            data: [0,0,0]
        }

        // Act
        requestMutator.updateBlockStats(mockBlockData)

        // Assert
        assert.strictEqual(state.blocksReceived, 1)
        assert.strictEqual(state.bytesReceived, 3)
    })

})