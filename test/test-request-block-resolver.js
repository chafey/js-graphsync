const assert = require('assert')
const Block = require('@ipld/block/defaults')
const {isResolved, isRejected} = require('./promise-helper')
const createRequestBlockResolver = require('../src/request-block-resolver')

describe('requestBlockResolver', async () => {

    const block = await Block.encoder({ hello: 'world' }, 'dag-cbor')
    const cid = await block.cid()

    it('get for block in blockstore returns block', async () => {
        // Arrange
        const memoryBlockStore = {get: async (cid) => block}
        const peerBlockBuffer = {get: (cid) => {}}
        const requestBlockResolver = createRequestBlockResolver(memoryBlockStore, peerBlockBuffer)

        // Act
        const resolvedBlock = await requestBlockResolver.get(await block.cid())

        // Assert
        assert.strictEqual(resolvedBlock, block)
    })

    it('get for block not in blockstore and not in peerBlockBuffer returns pending promise', async () => {
        // Arrange
        const memoryBlockStore = {get: async (cid) => {}}
        const peerBlockBuffer = {get: (cid) => {return Promise(() => {})}}
        const requestBlockResolver = createRequestBlockResolver(memoryBlockStore, peerBlockBuffer)

        // Act
        const getPromise = requestBlockResolver.get(await block.cid())

        // Assert
        assert.strictEqual(await isResolved(getPromise), false)
    })

    it('get for block not in blockstore and in peerBlockBuffer returns block', async () => {
        // Arrange
        const memoryBlockStore = {get: async (cid) => {}}
        const peerBlockBuffer = {get: (cid) => block}
        const requestBlockResolver = createRequestBlockResolver(memoryBlockStore, peerBlockBuffer)

        // Act
        const resolvedBlock = await requestBlockResolver.get(await block.cid())

        // Assert
        assert.strictEqual(resolvedBlock, block)
    })

    it('get for block rejected by blockStore returns rejected promise', async () => {
        // Arrange
        const memoryBlockStore = {get: (cid) => {return Promise.reject("mock error")}}
        const peerBlockBuffer = {get: (cid) => {}}
        const requestBlockResolver = createRequestBlockResolver(memoryBlockStore, peerBlockBuffer)

        // Act
        const getPromise = requestBlockResolver.get(await block.cid())

        // Assert
        assert.strictEqual(await isRejected(getPromise), true)
    })

    it('get for block rejected by peerBlockBuffer returns rejected promise', async () => {
        // Arrange
        const memoryBlockStore = {get: async (cid) => {}}
        const peerBlockBuffer = {get: (cid) => {return Promise.reject("mock error")}}
        const requestBlockResolver = createRequestBlockResolver(memoryBlockStore, peerBlockBuffer)

        // Act
        const getPromise = requestBlockResolver.get(await block.cid())

        // Assert
        assert.strictEqual(await isRejected(getPromise), true)
    })



})