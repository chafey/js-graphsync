const assert = require('assert')
const Block = require('@ipld/block/defaults')
const {isResolved, isRejected, isFinished} = require('./promise-helper')

const createPutOnGet = (blockStore, peerBlockBuffer) => {
    return (cid) => {
        const promise = peerBlockBuffer.get(cid)
        return promise.then((block) => {
            blockStore.put(block)
            return block
        })
    }
}

describe('putOnGet', async () => {

    let block 
    let cid

    before(async() => {
        block = await Block.encoder({ hello: 'world' }, 'dag-cbor')
        cid = await block.cid()
    })

    it('get with resolved block returns block', async () => {
        // Arrange
        const peerBlockBuffer = {get: async(cid) => {return block}}
        const blockStore = {put: async(block) => {}}
        const putOnGet = createPutOnGet(blockStore, peerBlockBuffer)

        // Act
        const resolvedBlock = await putOnGet(cid)

        // Assert
        assert.strictEqual(resolvedBlock, block)
    })

    it('get with pending promise returns pending promise', async () => {
        // Arrange
        const peerBlockBuffer = {get: (cid) => {return new Promise((resolve, reject) => {})}}
        const blockStore = {put: async(block) => {}}
        const putOnGet = createPutOnGet(blockStore, peerBlockBuffer)

        // Act
        const getPromise = putOnGet(cid)

        // Assert
        assert.strictEqual(await isFinished(getPromise), false)
    })

    it('get with resolved block puts block', async () => {
        // Arrange
        let put = false
        const peerBlockBuffer = {get: async(cid) => {return block}}
        const blockStore = {put: async(block) => {put = true}}
        const putOnGet = createPutOnGet(blockStore, peerBlockBuffer)

        // Act
        const resolvedBlock = await putOnGet(cid)

        // Assert
        assert.strictEqual(put, true)
    })

})