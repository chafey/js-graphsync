const assert = require('assert')
const Block = require('@ipld/block/defaults')
const generateBlocksFromBlockData = require('../src/generate-blocks-from-block-data')

describe('blockGenerator', () => {
    it('succeeds', async () => {
        // Arrange
        const blockData = [
            {prefix: new Uint8Array([1,113,18,32]), data: new Uint8Array([161,100,108,101,97,102,99,111,110,101])},
            {prefix: new Uint8Array([1,113,18,32]), data: new Uint8Array([161,100,108,101,97,102,99,116,119,111])}
        ]

        // Act
        const blockAndCIDs = []
        for await (blockAndCID of generateBlocksFromBlockData(blockData, Block)) {
            blockAndCIDs.push(blockAndCID)
        }

        // Assert
        assert.strictEqual(blockAndCIDs.length, 2)
        assert.strictEqual(blockAndCIDs[1].cid.toString(), 'bafyreibc7nmvewmyjt2dycvbxl32tder5w4lj6nqwpok6iol3f2nc262w4')
        assert.strictEqual(blockAndCIDs[0].cid.toString(), 'bafyreicn6wwnfwvmjo4tgwomzg7yrg7mae636jrfimk2glacimnehfqcim')
    })

    it('unknown codec returns undefined block', async () => {
        // Arrange
        const blockData = [
            {prefix: new Uint8Array([1,1,18,32]), data: new Uint8Array([161,100,108,101,97,102,99,111,110,101])},
        ]

        // Act
        const blockAndCIDs = []
        for await (blockAndCID of generateBlocksFromBlockData(blockData, Block)) {
            blockAndCIDs.push(blockAndCID)
        }

        // Act/Assert
        assert.strictEqual(blockAndCIDs.length, 1)
        assert.ok(blockAndCIDs[0].err)
    })
})