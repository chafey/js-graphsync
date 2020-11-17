const assert = require('assert')
const createPeerBlockBuffer = require('../src/peer-block-buffer.js')
const Block = require('@ipld/block/defaults')
const {isResolved, isRejected} = require('./promise-helper')

describe('peerBlockBuffer', async () => {

    const block = await Block.encoder({ hello: 'world' }, 'dag-cbor')
    const cid = await block.cid()

    it('get returns unresolved promise', async () => {
        // Arrange
        const peerBlockStore = createPeerBlockBuffer()

        // Act
        const getPromise = peerBlockStore.get(await block.cid())

        // Assert
        assert.strictEqual(await isResolved(getPromise), false)
    })

    it('put block', async () => {
        // Arrange
        const peerBlockStore = createPeerBlockBuffer()
        
        // Act
        const result = await peerBlockStore.put(cid, block)

        // Assert
        assert.strictEqual(result, undefined)
    })

    it('put undefined', async () => {
        // Arrange
        const peerBlockStore = createPeerBlockBuffer()

        // Act
        const result = await peerBlockStore.put(cid, undefined)

        // Assert
        assert.strictEqual(result, undefined)
    })

    it('get block after put block', async () => {
        // Arrange
        const peerBlockStore = createPeerBlockBuffer()
        await peerBlockStore.put(cid, block)

        // Act
        const storedBlock = await peerBlockStore.get(cid)
        
        // Assert
        assert.strictEqual(storedBlock, block)
    })

    it('get undefined after put undefined', async () => {
        // Arrange
        const peerBlockStore = createPeerBlockBuffer()
        await peerBlockStore.put(cid, undefined)

        // Act
        const storedBlock = await peerBlockStore.get(cid)
        
        // Assert
        assert.strictEqual(storedBlock, undefined)
    })


    it('get block before put block', async () => {
        // Arrange
        const peerBlockStore = createPeerBlockBuffer()
        await peerBlockStore.put(cid, block)

        // Act
        const storedBlock = await peerBlockStore.get(cid)
        
        // Assert
        assert.strictEqual(storedBlock, block)
    })

    it('get undefined before put undefined', async () => {
        // Arrange
        const peerBlockStore = createPeerBlockBuffer()
        await peerBlockStore.put(cid, undefined)

        // Act
        const storedBlock = await peerBlockStore.get(cid)
        
        // Assert
        assert.strictEqual(storedBlock, undefined)
    })

    it('get block after put undefined and put block', async () => {
        // Arrange
        const peerBlockStore = createPeerBlockBuffer()
        await peerBlockStore.put(cid, undefined)
        await peerBlockStore.put(cid, block)

        // Act
        const storedBlock = await peerBlockStore.get(cid)
        
        // Assert
        assert.strictEqual(storedBlock, block)
    })

    it('rejectUnresolved', async () => {
        // Arrange
        const peerBlockStore = createPeerBlockBuffer()
        const getPromise = peerBlockStore.get(cid)

        // Act
        await peerBlockStore.rejectUnresolved()

        // Assert
        assert.strictEqual(await isRejected(getPromise), true)
    })
})
