const codecFromPrefixBytes = require('../../src/util/codec-from-prefix-bytes')
const assert = require('assert')

describe('codec-from-prefix-bytes', () => {
    it('v0', async () => {
        const bytes = [0]

        const codec = codecFromPrefixBytes(bytes)

        assert.strictEqual(codec, 'dag-pb')
    })

    it('v1 with dag-pb', async () => {
        const bytes = [1, 112]

        const codec = codecFromPrefixBytes(bytes)

        assert.strictEqual(codec, 'dag-pb')
    })

    it('v1 with raw', async () => {
        const bytes = [1, 85]

        const codec = codecFromPrefixBytes(bytes)

        assert.strictEqual(codec, 'raw')
    })
})
