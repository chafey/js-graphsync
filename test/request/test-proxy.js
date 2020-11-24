const createRequestState = require('../../src/request/state')
const createRequestProxy = require('../../src/request/proxy')
const selectors = require('../../src/selectors')
const CID = require('cids')

const assert = require('assert')

const peerId = 'QmcrQZ6RJdpYuGvZqD5QEHAv6qX4BrQLJLQPQUrTrzdcgm'
const rootCID = new CID('bafyreidykglsfhoixmivffc5uwhcgshx4j465xwqntbmu43nb2dzqwfvae') // helloWorldBlock CID

const createRequestStateMock = () => {
    const id = 0
    const selector = selectors.depthLimitedGraph
    const blockGet = async (cid) => {}
    return createRequestState(id, peerId, blockGet, rootCID, selector)
}

describe('RequestProxy', () => {
    it('info returns state', async () => {
  
        // Arrange
        const state = createRequestStateMock()
        const requestProxy = createRequestProxy(state)

        // Act
        const info = requestProxy.info()

        // Assert
        assert.strictEqual(info.id, 0)
        assert.strictEqual(info.peerId, peerId)
        assert.strictEqual(info.rootCID, rootCID)
        assert.strictEqual(info.selector, selectors.depthLimitedGraph)
    })
 
    it('complete returns completed promise', async () => {
  
        // Arrange
        const state = createRequestStateMock()
        const requestProxy = createRequestProxy(state)

        // Act
        const info = requestProxy.info()

        // Assert
        assert.strictEqual(info.id, 0)
        assert.strictEqual(info.peerId, peerId)
        assert.strictEqual(info.rootCID, rootCID)
        assert.strictEqual(info.selector, selectors.depthLimitedGraph)
    })


})
