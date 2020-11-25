const assert = require('assert')
const createMemoryBlockStore = require('../helpers/memory-block-store')
const createSimpleDAG = require('./fixtures/create-simple-dag')
const depthFirstTraversal = require('../src/depth-first-traversal')

const createBlockGetLogger = (blockGet) => {
    const log = []

    const get = async(cid) => {
        const block = await blockGet(cid)
        log.push({cid, block})
        return block
    }

    return {
        get,
        log
    }
}

describe('depthFirstTraversal', () => {
 
    let simpleDAG = []

    before(async() => {
        simpleDAG = await createSimpleDAG()
    })
 
    it('succeeds', async () => {
        // Arrange
        const blockStore = createMemoryBlockStore()
        await Promise.all(simpleDAG.map(async({block}) => await blockStore.put(block)))
        const blockGetLogger = createBlockGetLogger(blockStore.get)

        // Act
        await depthFirstTraversal(simpleDAG[0].cid, 100, blockGetLogger.get)

        // Assert
        assert.strictEqual(blockGetLogger.log.length, 3)
        assert.notDeepStrictEqual(blockGetLogger.logp, simpleDAG)
    })

    it('terminates with rejected promise if blockstore get rejects', async () => {
        // Arrange
        const blockGetLogger = createBlockGetLogger(async (cid) => Promise.reject(new Error('test error')))

        // Act
        const promise = depthFirstTraversal(simpleDAG[0].cid, 100, blockGetLogger.get)

        // Assert
        assert.rejects(promise)
        assert.strictEqual(blockGetLogger.log.length, 0)
    })

    it('traversal does not exceed depth limit', async () => {
        // Arrange
        const blockStore = createMemoryBlockStore()
        await Promise.all(simpleDAG.map(async({block}) => await blockStore.put(block)))
        const blockGetLogger = createBlockGetLogger(blockStore.get)

        // Act
        await depthFirstTraversal(simpleDAG[0].cid, 1, blockGetLogger.get)

        // Assert
        assert.strictEqual(blockGetLogger.log.length, 1)
        assert.deepStrictEqual(blockGetLogger.log, [simpleDAG[0]])
    })
})
