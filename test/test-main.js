const graphSync = require('../src')
const assert = require('assert')

describe('GraphSync Library', () => {
    it('exports', () => {
        assert(graphSync)
        assert(graphSync.init)
    })
})