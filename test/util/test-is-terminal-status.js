const isTerminalStatus = require('../../src/util/is-terminal-status')
const assert = require('assert')

describe('isTerminalStatus', () => {
    it('info-partial statuses', async () => {
        assert.ok(!isTerminalStatus(10))
        assert.ok(!isTerminalStatus(11))
        assert.ok(!isTerminalStatus(12))
        assert.ok(!isTerminalStatus(13))
        assert.ok(!isTerminalStatus(14))
        assert.ok(!isTerminalStatus(15))
    })

    it('success statuses', async () => {
        assert.ok(isTerminalStatus(20))
        assert.ok(isTerminalStatus(21))
    })

    it('error statuses', async () => {
        assert.ok(isTerminalStatus(30))
        assert.ok(isTerminalStatus(31))
        assert.ok(isTerminalStatus(32))
        assert.ok(isTerminalStatus(33))
        assert.ok(isTerminalStatus(34))
    })
})
