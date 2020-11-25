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
        const simpleDAG = await createSimpleDAG()
        await Promise.all(simpleDAG.map(async({block}) => {await blockStore.put(block)}))

        const traversed = []
        const blockGet = async (cid) => {
            const block = await blockStore.get(cid)
            traversed.push({cid, block})
            return block
        }

        const requestValidator = createRequestValidator(simpleDAG[0].cid, selectors.depthLimitedGraph, blockGet)

        // Act
        await requestValidator

        // assert
        assert.strictEqual(traversed.length, 3)
        assert.notStrictEqual(traversed, simpleDAG)
    })
})