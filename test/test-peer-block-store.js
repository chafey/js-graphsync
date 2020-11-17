const assert = require('assert')
const Block = require('@ipld/block/defaults')
const {isResolved, isRejected} = require('./promise-helper')

const createPeerBlockStore = (blockStore) => {
    const blockResolvers = {}

    newBlockResolver = (cidAsString) => {
        const blockResolver = {}
        blockResolver.promise = new Promise((resolve, reject) => {
            blockResolver.resolve = resolve
            blockResolver.reject = reject
            blockResolver.finalized = false
        }) 
        blockResolvers[cidAsString] = blockResolver
        blockResolver.promise.finally(() => {
            blockResolver.finalized = true
        })
        return blockResolver
    }

    getBlockResolver = (cid) => {
        const cidAsString = cid.toString()
        const blockResolver = blockResolvers[cidAsString]
        if(!blockResolver) {
            return newBlockResolver(cidAsString)
        } else {
            return blockResolver
        }
    }

    return {
        put: async (cid, block) => {
            const blockResolver = getBlockResolver(cid)
            if(!blockResolver.finalized) {
                blockResolver.resolve(block)
            } else {
                const blockResolver = newBlockResolver(cid.toString())
                blockResolver.resolve(block)
            }
        },
        get: cid => {
            const blockResolver = getBlockResolver(cid)
            return blockResolver.promise
        },
        rejectUnresolved: async () => {
            for(const key in blockResolvers) {
                const blockResolver = blockResolvers[key]
                blockResolver.reject()
            }
        }
    }
}

describe('peerBlockStore', async () => {

    const block = await Block.encoder({ hello: 'world' }, 'dag-cbor')
    const cid = await block.cid()

    it('get returns unresolved promise', async () => {
        // Arrange
        const peerBlockStore = createPeerBlockStore()

        // Act
        const getPromise = peerBlockStore.get(await block.cid())

        // Assert
        assert.strictEqual(await isResolved(getPromise), false)
    })

    it('put block', async () => {
        // Arrange
        const peerBlockStore = createPeerBlockStore()
        
        // Act
        const result = await peerBlockStore.put(cid, block)

        // Assert
        assert.strictEqual(result, undefined)
    })

    it('put undefined', async () => {
        // Arrange
        const peerBlockStore = createPeerBlockStore()

        // Act
        const result = await peerBlockStore.put(cid, undefined)

        // Assert
        assert.strictEqual(result, undefined)
    })

    it('get block after put block', async () => {
        // Arrange
        const peerBlockStore = createPeerBlockStore()
        await peerBlockStore.put(cid, block)

        // Act
        const storedBlock = await peerBlockStore.get(cid)
        
        // Assert
        assert.strictEqual(storedBlock, block)
    })

    it('get undefined after put undefined', async () => {
        // Arrange
        const peerBlockStore = createPeerBlockStore()
        await peerBlockStore.put(cid, undefined)

        // Act
        const storedBlock = await peerBlockStore.get(cid)
        
        // Assert
        assert.strictEqual(storedBlock, undefined)
    })


    it('get block before put block', async () => {
        // Arrange
        const peerBlockStore = createPeerBlockStore()
        await peerBlockStore.put(cid, block)

        // Act
        const storedBlock = await peerBlockStore.get(cid)
        
        // Assert
        assert.strictEqual(storedBlock, block)
    })

    it('get undefined before put undefined', async () => {
        // Arrange
        const peerBlockStore = createPeerBlockStore()
        await peerBlockStore.put(cid, undefined)

        // Act
        const storedBlock = await peerBlockStore.get(cid)
        
        // Assert
        assert.strictEqual(storedBlock, undefined)
    })

    it('get block after put undefined and put block', async () => {
        // Arrange
        const peerBlockStore = createPeerBlockStore()
        await peerBlockStore.put(cid, undefined)
        await peerBlockStore.put(cid, block)

        // Act
        const storedBlock = await peerBlockStore.get(cid)
        
        // Assert
        assert.strictEqual(storedBlock, block)
    })




    it('rejectUnresolved', async () => {
        // Arrange
        const peerBlockStore = createPeerBlockStore()
        const getPromise = peerBlockStore.get(cid)

        // Act
        await peerBlockStore.rejectUnresolved()

        // Assert
        assert.strictEqual(await isRejected(getPromise), true)
    })

    it('rejectUnresolved does not reject get', async () => {
        // Arrange
        const peerBlockStore = createPeerBlockStore()
        const getPromise = peerBlockStore.get(cid)
        await peerBlockStore.put(cid, block)

        // Act
        await peerBlockStore.rejectUnresolved()

        // Assert
        assert.strictEqual(await isRejected(getPromise), false)
    })
})
