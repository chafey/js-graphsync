const assert = require('assert')
const createMemoryBlockStore = require('../helpers/memory-block-store')
const createSimpleDAG = require('./fixtures/create-simple-dag')


const createDepthFirstTraversal = (root, blockStore, depthLimit=100) => {
    const depthFirstTraversal = async (root, blockStore, depthLimit) => {

        if (depthLimit <= 0) return []
    
        let cids = []
    
        try {
            const block = await blockStore.get(root)
    
            cids.push(root)
        
            for (const [path, link] of block.reader().links()) {
                const nodes = path.split('/').length
                cids = cids.concat(await depthFirstTraversal(link, blockStore, depthLimit - nodes))
            }
        
        } catch (err) {
            //console.log('exception:', err)
        }
    
        return cids
    }
    return async() => {
        return depthFirstTraversal(root, blockStore, depthLimit)
    }
}

describe('depthFirstTraversal', () => {
    it('succeeds', async () => {
        // Arrange
        const blockStore = createMemoryBlockStore()
        const blocks = await createSimpleDAG()
        const cids = await Promise.all(blocks.map(async(block) => {
            await blockStore.put(block)
            return block.cid()
        }))
        const traverse = createDepthFirstTraversal(cids[0], blockStore)

        // Act
        const traversedCIDs = await traverse()

        // Assert
        assert.strictEqual(traversedCIDs.length, 3)
        assert.deepStrictEqual(traversedCIDs, cids)
    })

    it('terminates if blockstore get rejects', async () => {
        // Arrange
        const blockStore = createMemoryBlockStore()
        const blocks = await createSimpleDAG()
        await blockStore.put(blocks[0])
        const root  = await blocks[0].cid()
        const traverse = createDepthFirstTraversal(root, blockStore)

        // Act
        const traversedCIDs = await traverse()

        // Assert
        assert.strictEqual(traversedCIDs.length, 1)
        assert.deepStrictEqual(traversedCIDs, [root])
    })

    it('traversal does not exceed depth limit', async () => {
        // Arrange
        const blockStore = createMemoryBlockStore()
        const blocks = await createSimpleDAG()
        const cids = await Promise.all(blocks.map(async(block) => {
            await blockStore.put(block)
            return block.cid()
        }))
        const traverse = createDepthFirstTraversal(cids[0], blockStore, 1)

        // Act
        const traversedCIDs = await traverse()

        // Assert
        assert.strictEqual(traversedCIDs.length, 1)
        assert.deepStrictEqual(traversedCIDs, [cids[0]])
    })
})
