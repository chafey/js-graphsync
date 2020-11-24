const createRequestState = require('../../src/request/state')
const selectors = require('../../src/selectors')
const CID = require('cids')

const assert = require('assert')

const peerId = 'QmcrQZ6RJdpYuGvZqD5QEHAv6qX4BrQLJLQPQUrTrzdcgm'
const rootCID = new CID('bafyreidykglsfhoixmivffc5uwhcgshx4j465xwqntbmu43nb2dzqwfvae') // helloWorldBlock CID

describe('RequestState', () => {
    it('create succeeds', async () => {
        // Arrange
        const id = 0
        const selector = selectors.depthLimitedGraph
        const blockGet = async (cid) => {}
        // Act
        const state = createRequestState(id, peerId, blockGet, rootCID, selector)

        // assert
        assert.strictEqual(state.id, id)
        assert.strictEqual(state.peerId, peerId)
        assert.strictEqual(state.rootCID, rootCID)
        assert.strictEqual(state.selector, selector)
        assert.strictEqual(state.status, 0)
        assert.strictEqual(state.blocksReceived, 0)
        assert.ok(state.completed)
        assert.ok(state.promiseResolve)
        assert.ok(state.promiseReject)
    })

    it('promiseResolve resolves', async () => {
        // Arrange
        const id = 0
        const selector = selectors.depthLimitedGraph
        const blockGet = async (cid) => {}

        // Act
        const state = createRequestState(id, peerId, blockGet, rootCID, selector)
        state.promiseResolve()

        // assert
        await state.completed
    })

    it('promiseReject rejects', async () => {
        // Arrange
        const id = 0
        const selector = selectors.depthLimitedGraph
        const blockGet = async (cid) => {}

        // Act
        const state = createRequestState(id, peerId, blockGet, rootCID, selector)
        state.promiseReject()

        // assert
        assert.rejects(state.completed)
    })
})