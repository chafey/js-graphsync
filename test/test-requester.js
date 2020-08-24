const graphSync = require('../src')
const assert = require('assert')

const createMockNetwork = () => {
    return {}
}
const createMockLoader = () => {
    return {}
}
const createMockStorer = () => {
    return {}
}

const createContext = () => {
    return {
        blocksStored: 0
    }
}

const createMockedGraphSyncExchange = async () => {
    const mockNetwork = createMockNetwork()
    const mockLoader = createMockLoader()
    const mockStorer = createMockStorer()

    return graphSync.new(mockNetwork, mockLoader, mockStorer)
}

describe('Requester', () => {
    it('request succeeds', async () => {
        const exchange = await createMockedGraphSyncExchange()
        assert.ok(exchange, 'failed to create graphsync exchange')
        const context = createContext()
        const root = {}
        const selector = {}
        const progress = await exchange.request(context, root, selector)
        assert.ok(progress, 'failed to create requestr')
        assert.doesNotReject(progress.complete(), 'progress.complete() returned rejected promise')
        assert.equal(context.blocksStored, 1)
    })
})