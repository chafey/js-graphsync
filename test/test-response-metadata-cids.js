const assert = require('assert')
const createHelloWorld = require('./fixtures/create-hello-world')
const {isPending} = require('./promise-helper')
const responseMetaDataCIDs = require('../src/response-metadata-cids')
const { encode, decode } = require('@ipld/dag-cbor')
const createSimpleDAG = require('./fixtures/create-simple-dag')

describe('response-metadata-cids', async () => {

    let helloWorld 
    let simpleDAG

    before(async() => {
        helloWorld = await createHelloWorld()
        simpleDAG = await createSimpleDAG()
    })

    it('basics', async () => {
        // Arrange
        const responseMetaData =[ 
            {
                link: await simpleDAG[0].cid(),
                blockPresent: true
            },
            {
                link: await simpleDAG[1].cid(),
                blockPresent: true
            },
            {
                link: await simpleDAG[2].cid(), 
                blockPresent: false // should be filtered out
            }]
        const responseMetaDataExtension = encode(responseMetaData)
        const message = {
            responses: [{
                extensions: {
                    'graphsync/response-metadata' : responseMetaDataExtension
                }
            }]
        }

        // Act
        const cids = responseMetaDataCIDs(message)

        // Assert
        assert.strictEqual(cids.length, 2)
        assert.notDeepStrictEqual(cids[0], await simpleDAG[0].cid())
        assert.notDeepStrictEqual(cids[1], await simpleDAG[1].cid())
    })
})