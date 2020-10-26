const prefixBytesFromCIDBytes = require('../../src/util/prefix-bytes-from-cid-bytes')
const assert = require('assert')
const CID = require('cids')

describe('prefixBytesFromCIDBytes', () => {
    it('js-cid succeeds', async () => {
        const cid = new CID('bafyreidykglsfhoixmivffc5uwhcgshx4j465xwqntbmu43nb2dzqwfvae')

        const prefix = prefixBytesFromCIDBytes(cid.bytes)

        assert.strictEqual(prefix.length, 4)
    })

    it('invalid cid fails', async () => {
        const bytes = []
        
        assert.throws(() => prefixBytesFromCIDBytes(bytes))
    })

})