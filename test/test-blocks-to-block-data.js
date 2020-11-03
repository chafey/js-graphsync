const assert = require('assert')
const blocksToBlockData = require('../src/blocks-to-block-data')
const Block = require('@ipld/block/defaults')

describe('blocksToBlockData', () => {
    it('succeeds', async () => {
        // Arrange
        const leaf1 = await Block.encoder({leaf: "one"}, "dag-cbor") // bafyreibc7nmvewmyjt2dycvbxl32tder5w4lj6nqwpok6iol3f2nc262w4
        const leaf2 = await Block.encoder({leaf: "two"}, "dag-cbor") // bafyreicn6wwnfwvmjo4tgwomzg7yrg7mae636jrfimk2glacimnehfqcim
        const blocks = [leaf1, leaf2]

        // Act
        const blockData = await blocksToBlockData(blocks)

        // Assert
        assert.strictEqual(blockData.length, 2)
        assert.deepStrictEqual(blockData[0].prefix, new Uint8Array([1,113,18,32]))
        assert.deepStrictEqual(blockData[0].data, new Uint8Array([161,100,108,101,97,102,99,111,110,101]))
        assert.deepStrictEqual(blockData[1].prefix, new Uint8Array([1,113,18,32]))
        assert.deepStrictEqual(blockData[1].data, new Uint8Array([161,100,108,101,97,102,99,116,119,111]))
    })

})
