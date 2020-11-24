const assert = require('assert')
const createHelloWorld = require('../fixtures/create-hello-world')
const {isPending} = require('../promise-helper')
const selectors = require('../../src/selectors')
const createRequestValidator = require('../../src/request/validator')

describe('RequestValidator', () => {

    let helloWorld 

    before(async() => {
        helloWorld = await createHelloWorld()
    })

    it('basics', async () => {
        // Arrange
        let blockGetCallCount = 0
        const blockGet = (cid) => {
            blockGetCallCount++
            return Promise.resolve(helloWorld.block)
        }
        const requestValidator = createRequestValidator(helloWorld.cid, selectors.depthLimitedGraph, blockGet)

        // Act
        await requestValidator

        // assert
        assert.strictEqual(blockGetCallCount,1)
    })


})