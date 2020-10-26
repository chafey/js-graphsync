const Block = require('@ipld/block/defaults')

const createResponseHandler = require('../../src/response/handler')
const createRequestState = require('../../src/request/state')
const createRequestMutator = require('../../src/request/mutator')
const createRequestProxy = require('../../src/request/proxy')
const prefixBytesFromCIDBytes = require('../../src/util/prefix-bytes-from-cid-bytes')
const selectors = require('../../src/selectors')
const createMemoryBlockStore = require('../../helpers/memory-block-store')

const assert = require('assert')

const peerId = 'QmcrQZ6RJdpYuGvZqD5QEHAv6qX4BrQLJLQPQUrTrzdcgm'
const helloWorldBlock = Block.encoder({ hello: 'world' }, 'dag-cbor')

let helloWorldBlockCID 
const initLocal = async () => {
    helloWorldBlockCID = await helloWorldBlock.cid()
}
initLocal()

const createRequestStateMock = () => {
    const id = 0
    const selector = selectors.depthLimitedGraph
    return createRequestState(id, peerId, helloWorldBlockCID, selector)
}

describe('responseHandler', () => {
    it('status is updated with non terminal status for in progress request', async () => {
        // Arrange
        const blockStore = createMemoryBlockStore()
        const responseHandler = createResponseHandler(Block, blockStore)
        const state = createRequestStateMock()
        const proxy = createRequestProxy(state)
        const mutator = createRequestMutator(state)
        const mockResponse = {
            id: 0,
            status: 10
        }

        // Act
        await responseHandler(proxy, mutator, mockResponse, [])

        // Assert
        assert.strictEqual(state.status, 10)
    })

    it('status is not changed for completed request', async () => {
        // Arrange
        const blockStore = createMemoryBlockStore()
        const responseHandler = createResponseHandler(Block, blockStore)
        const state = createRequestStateMock()
        const proxy = createRequestProxy(state)
        const mutator = createRequestMutator(state)
        const mockResponse = {
            id: 0,
            status: 20
        }
        await responseHandler(proxy, mutator, mockResponse, [])

        const mockResponse2 = {
            id: 0,
            status: 10
        }

        // Act
        await responseHandler(proxy, mutator, mockResponse2, [])

        // Assert
        assert.strictEqual(state.status, 20)
    })

    it('response with valid block stored in block store for in progress request', async () => {
        // Arrange
        const blockStore = createMemoryBlockStore()
        const responseHandler = createResponseHandler(Block, blockStore)
        const state = createRequestStateMock()
        const proxy = createRequestProxy(state)
        const mutator = createRequestMutator(state)
        const mockResponse = {
            id: 0,
            status: 20
        }
        const mockBlockData = {
            prefix: prefixBytesFromCIDBytes(helloWorldBlockCID.bytes),
            data: helloWorldBlock.encode()
        }

        // Act
        await responseHandler(proxy, mutator, mockResponse, [mockBlockData])

        // Assert
        assert.ok(await blockStore.get(helloWorldBlockCID))
        assert.deepStrictEqual((await blockStore.get(helloWorldBlockCID)).encode(), helloWorldBlock.encode())
    })

    it('response with valid block updates request status for in progress request', async () => {
        // Arrange
        const blockStore = createMemoryBlockStore()
        const responseHandler = createResponseHandler(Block, blockStore)
        const state = createRequestStateMock()
        const proxy = createRequestProxy(state)
        const mutator = createRequestMutator(state)
        const mockResponse = {
            id: 0,
            status: 20
        }
        const mockBlockData = {
            prefix: prefixBytesFromCIDBytes(helloWorldBlockCID.bytes),
            data: helloWorldBlock.encode()
        }

        // Act
        await responseHandler(proxy, mutator, mockResponse, [mockBlockData])

        // Assert
        assert.strictEqual(proxy.status().blocksReceived, 1)
        assert.strictEqual(proxy.status().bytesReceived, 13)
    })

})
