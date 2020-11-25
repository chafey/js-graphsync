const assert = require('assert')
const createHelloWorld = require('../fixtures/create-hello-world')
const {isPending} = require('../promise-helper')
const createBlockDataMessageHandler = require('../../src/message-handlers/block-data')
const { encode, decode } = require('@ipld/dag-cbor')
const createSimpleDAG = require('../fixtures/create-simple-dag')
const Block = require('@ipld/block/defaults')
const prefixBytesFromCIDBytes = require('../../src/util/prefix-bytes-from-cid-bytes')

describe('blockDataMessageHandler', async () => {

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
            }], 
            data: [
                {
                    prefix: prefixBytesFromCIDBytes((simpleDAG[0].cid).bytes),
                    data: simpleDAG[0].block.encode()
                },
                {
                    prefix: prefixBytesFromCIDBytes((simpleDAG[1].cid).bytes),
                    data: simpleDAG[1].block.encode()
                }
            ]
        }
        let numBlocksPut = 0
        const getBlockBuffer = (peerId) => {
            return {
                put: (cid, block) => {
                    numBlocksPut++}
            }
        }
        const messageHandler = createBlockDataMessageHandler(getBlockBuffer, Block)

        // Act
        await messageHandler("peerId", message)

        // Assert
        assert.strictEqual(numBlocksPut, 2)
    })
})