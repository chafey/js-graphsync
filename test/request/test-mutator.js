const createRequestState = require('../../src/request/state')
const createRequestMutator = require('../../src/request/mutator')
const selectors = require('../../src/selectors')
const CID = require('cids')

const assert = require('assert')

const peerId = 'QmcrQZ6RJdpYuGvZqD5QEHAv6qX4BrQLJLQPQUrTrzdcgm'
const rootCID = new CID('bafyreidykglsfhoixmivffc5uwhcgshx4j465xwqntbmu43nb2dzqwfvae') // helloWorldBlock CID

const createRequestStateMock = () => {
    const id = 0
    const selector = selectors.exploreAll
    return createRequestState(id, peerId, rootCID, selector)
}

describe('RequestMutator', () => {
    it('terminal response resolves completed promise', async () => {
  
        // Arrange
        const state = createRequestStateMock()
        const requestMutator = createRequestMutator(state)

        const mockResponse = {
            status: 20 // Request Completed, full content
        }
        const mockData = []

        // Act
        requestMutator.handleResponse(mockResponse, mockData)
    
        // Assert
        await state.completed // should complete
    })

    it('non terminal response does not resolve completed', async () => {
  
        // Arrange
        const state = createRequestStateMock()
        const requestMutator = createRequestMutator(state)

        const mockResponse = {
            status: 10 // request acknowledged, working on it
        }
        const mockData = []

        // Act
        requestMutator.handleResponse(mockResponse, mockData)
    
        // Assert
        promisePending = true
        state.completed.finally(() => {
            promisePending = false
        })
        assert.strictEqual(promisePending, true)
    })

    it('non terminal response does not change status of completed request', async () => {
        // Arrange
        const state = createRequestStateMock()
        const requestMutator = createRequestMutator(state)

        // Act
        requestMutator.handleResponse({status: 20}, [])
        requestMutator.handleResponse({status: 10}, [])
    
        // Assert
        assert.strictEqual(state.status, 20)
    })


})