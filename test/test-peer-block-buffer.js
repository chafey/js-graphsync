const assert = require('assert')
const createPeerBlockBuffer = require('../src/peer-block-buffer.js')
const Block = require('@ipld/block/defaults')
const {isResolved, isRejected} = require('./promise-helper')
const { get } = require('http')

describe('peerBlockBuffer', () => {

    let block 
    let cid

    before(async() => {
        block = await Block.encoder({ hello: 'world' }, 'dag-cbor')
        cid = await block.cid()
    })

    it('get returns unresolved promise', async () => {
        // Arrange
        const peerBlockBuffer = createPeerBlockBuffer()

        // Act
        const getPromise = peerBlockBuffer.get(await block.cid())

        // Assert
        assert.strictEqual(await isResolved(getPromise), false)
    })

    it('put block', async () => {
        // Arrange
        const peerBlockBuffer = createPeerBlockBuffer()
        
        // Act
        const result = await peerBlockBuffer.put(cid, block)

        // Assert
        assert.strictEqual(result, undefined)
    })

    it('put undefined', async () => {
        // Arrange
        const peerBlockBuffer = createPeerBlockBuffer()

        // Act
        const result = await peerBlockBuffer.put(cid, undefined)

        // Assert
        assert.strictEqual(result, undefined)
    })

    it('get block after put block', async () => {
        // Arrange
        const peerBlockBuffer = createPeerBlockBuffer()
        await peerBlockBuffer.put(cid, block)

        // Act
        const storedBlock = await peerBlockBuffer.get(cid)
        
        // Assert
        assert.strictEqual(storedBlock, block)
    })

    it('get undefined after put undefined', async () => {
        // Arrange
        const peerBlockBuffer = createPeerBlockBuffer()
        await peerBlockBuffer.put(cid, undefined)

        // Act
        const storedBlock = await peerBlockBuffer.get(cid)
        
        // Assert
        assert.strictEqual(storedBlock, undefined)
    })


    it('get block before put block', async () => {
        // Arrange
        const peerBlockBuffer = createPeerBlockBuffer()
        await peerBlockBuffer.put(cid, block)

        // Act
        const storedBlock = await peerBlockBuffer.get(cid)
        
        // Assert
        assert.strictEqual(storedBlock, block)
    })

    it('get undefined before put undefined', async () => {
        // Arrange
        const peerBlockBuffer = createPeerBlockBuffer()
        await peerBlockBuffer.put(cid, undefined)

        // Act
        const storedBlock = await peerBlockBuffer.get(cid)
        
        // Assert
        assert.strictEqual(storedBlock, undefined)
    })

    it('get block after put undefined and put block', async () => {
        // Arrange
        const peerBlockBuffer = createPeerBlockBuffer()
        await peerBlockBuffer.put(cid, undefined)
        await peerBlockBuffer.put(cid, block)

        // Act
        const storedBlock = await peerBlockBuffer.get(cid)
        
        // Assert
        assert.strictEqual(storedBlock, block)
    })

    it('has returns false if block not present', async () => {
        // Arrange
        const peerBlockBuffer = createPeerBlockBuffer()

        // Act
        const hasBlock = peerBlockBuffer.has(cid)
        
        // Assert
        assert.strictEqual(hasBlock, false)
    })

    it('has returns true if block is present', async () => {
        // Arrange
        const peerBlockBuffer = createPeerBlockBuffer()
        await peerBlockBuffer.put(cid, block)

        // Act
        const hasBlock = peerBlockBuffer.has(cid)
        
        // Assert
        assert.strictEqual(hasBlock, true)
    })

    it('has returns false after get block resolves', async () => {
        // Arrange
        const peerBlockBuffer = createPeerBlockBuffer()
        await peerBlockBuffer.put(cid, block)
        await peerBlockBuffer.get(cid)

        // Act
        const hasBlock = peerBlockBuffer.has(cid)
        
        // Assert
        assert.strictEqual(hasBlock, false)
    })
/*
    it('rejectUnresolved', async () => {
        // Arrange
        const peerBlockBuffer = createPeerBlockBuffer()
        const getPromise = peerBlockBuffer.get(cid)

        // Act
        peerBlockBuffer.rejectUnresolved()

        // Assert
        assert.rejects(getPromise)
    })*/
})
