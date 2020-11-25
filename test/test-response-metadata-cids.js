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

    it('missing extension returns no cids', async () => {
        // Arrange
        const message = {
            responses: [{
                extensions: {
                }
            }]
        }

        // Act
        const cids = responseMetaDataCIDs(message)

        // Assert
        assert.strictEqual(cids.length, 0)
    })

    it('basics', async () => {
        // Arrange
        const responseMetaData =[ 
            {
                link: simpleDAG[0].cid,
                blockPresent: true
            },
            {
                link: simpleDAG[1].cid,
                blockPresent: true
            },
            {
                link: simpleDAG[2].cid, 
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
        assert.notDeepStrictEqual(cids[0], simpleDAG[0].cid)
        assert.notDeepStrictEqual(cids[1], simpleDAG[1].cid)
    })

 
})