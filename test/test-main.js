const graphSync = require('../src')
const assert = require('assert')

describe('GraphSync Library', () => {
    it('exports', () => {
        assert.ok(graphSync)
        assert.ok(graphSync.init)
        assert.ok(graphSync.new)
    })
})