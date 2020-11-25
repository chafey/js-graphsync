const assert = require('assert')
const createHelloWorld = require('../fixtures/create-hello-world')
const {isPending} = require('../promise-helper')
const selectors = require('../../src/selectors')
const createRequestValidator = require('../../src/request/validator')
const createMemoryBlockStore = require('../../helpers/memory-block-store')
const createSimpleDAG = require('../fixtures/create-simple-dag')

describe('RequestValidator', () => {

    let helloWorld 

    before(async() => {
        helloWorld = await createHelloWorld()
    })

    it('basics', async () => {
        // Arrange
        const blockStore = createMemoryBlockStore()
        const blocks = await createSimpleDAG()
        const cids = await Promise.all(blocks.map(async(block) => {
            await blockStore.put(block)
            return block.cid()
        }))
        const traversedCIDs = []
        const blockGet = async (cid) => {
            const block = await blockStore.get(cid)
            traversedCIDs.push(cid)
            return block
        }

        const requestValidator = createRequestValidator(cids[0], selectors.depthLimitedGraph, blockGet)

        // Act
        await requestValidator

        // assert
        assert.strictEqual(traversedCIDs.length, 3)
        assert.deepStrictEqual(traversedCIDs, cids)
    })
})