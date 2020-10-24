const selectors = require('../src/selectors')
const assert = require('assert')

describe('Selectors', () => {
    it('exports', () => {
        assert.ok(selectors)
        assert.ok(selectors.depthLimitedGraph)
        assert.ok(selectors.fullGraph)
    })
})