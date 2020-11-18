const assert = require('assert')
const createHelloWorld = require('./fixtures/create-hello-world')
const {isPending} = require('./promise-helper')
const createBlockBuffer = require('./../src/block-buffer')

describe('blockBuffer', async () => {

    let helloWorld 

    before(async() => {
        helloWorld = await createHelloWorld()
    })

    it('get returns pending promise', async () => {
        // Arrange
        const blockBuffer = createBlockBuffer()

        // Act
        const promise = blockBuffer.get(helloWorld.cid)

        // Assert
        assert.strictEqual(await isPending(promise), true)
    })

    it('put returns pending promise', async () => {
        // Arrange
        const blockBuffer = createBlockBuffer()

        // Act
        const promise = blockBuffer.put(helloWorld.cid, helloWorld.block)

        // Assert
        assert.strictEqual(await isPending(promise), true)
    })

    it('get after put resolves to block', async () => {
        // Arrange
        const blockBuffer = createBlockBuffer()
        blockBuffer.put(helloWorld.cid, helloWorld.block)

        // Act
        const block = await blockBuffer.get(helloWorld.cid)

        // Assert
        assert.strictEqual(block, helloWorld.block)
    })

    it('get before put resolves to block', async () => {
        // Arrange
        const blockBuffer = createBlockBuffer()
        const promise =  blockBuffer.get(helloWorld.cid)

        // Act
        blockBuffer.put(helloWorld.cid, helloWorld.block)

        // Assert
        assert.strictEqual(await promise, helloWorld.block)
    })

    it('put after get resolves to block', async function () {
        // Arrange
        const blockBuffer = createBlockBuffer()
        blockBuffer.get(helloWorld.cid)

        // Act
        const promise = blockBuffer.put(helloWorld.cid, helloWorld.block)

        // Assert
        assert.doesNotReject(promise)
        assert.strictEqual(await promise, helloWorld.block)
    })

    it('put before get resolves to block', async () => {
        // Arrange
        const blockBuffer = createBlockBuffer()
        const promise = blockBuffer.put(helloWorld.cid, helloWorld.block)

        // Act
        blockBuffer.get(helloWorld.cid)

        // Assert
        assert.strictEqual(await promise, helloWorld.block)
    })

    it('get after replaced put resolves to block', async function () {
        // Arrange
        const blockBuffer = createBlockBuffer()
        blockBuffer.put(helloWorld.cid, undefined)
        blockBuffer.put(helloWorld.cid, helloWorld.block)

        // Act
        const promise = blockBuffer.get(helloWorld.cid)

        // Assert
        assert.strictEqual(await promise, helloWorld.block)
    })
    
    it('get for block that was previously resolved returns pending promise', async function () {
        // Arrange
        const blockBuffer = createBlockBuffer()
        blockBuffer.put(helloWorld.cid, helloWorld.block)
        await blockBuffer.get(helloWorld.cid)

        // Act
        const promise = blockBuffer.get(helloWorld.cid)

        // Assert
        assert.strictEqual(await isPending(promise), true)
    })

    it('get after put/rejectAll returns pending promise', async () => {
        // Arrange
        const blockBuffer = createBlockBuffer()
        const putPromise = blockBuffer.put(helloWorld.cid, helloWorld.block)
        putPromise.catch(() => {})
        await blockBuffer.rejectAll()

        // Act
        const promise = blockBuffer.get(helloWorld.cid)

        // Assert
        assert.strictEqual(await isPending(promise), true)
    })

    it('get before rejectAll returns rejected promise', async () => {
        // Arrange
        const blockBuffer = createBlockBuffer()
        const promise = blockBuffer.get(helloWorld.cid)

        // Act
        await blockBuffer.rejectAll()

        // Assert
        assert.rejects(promise)
    })

    it('put before rejectAll returns rejected promise', async () => {
        // Arrange
        const blockBuffer = createBlockBuffer()
        const promise = blockBuffer.put(helloWorld.cid, helloWorld.block)

        // Act
        await blockBuffer.rejectAll()

        // Assert
        assert.rejects(promise)
    })
})