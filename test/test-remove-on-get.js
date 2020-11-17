const assert = require('assert')
const Block = require('@ipld/block/defaults')
const {isResolved, isRejected} = require('./promise-helper')

const createRemoveOnGet = (peerBlockBuffer) => {
    return (cid) => {
        const promise = peerBlockBuffer.get(cid)
        return promise.then((block) => {
            peerBlockBuffer.remove(cid)
            return block
        })
    }
}

describe('removeOnGet', () => {

    let block 
    let cid

    before(async() => {
        block = await Block.encoder({ hello: 'world' }, 'dag-cbor')
        cid = await block.cid()
    })

    it('get returns block', async () => {
        // Arrange
        const peerBlockBuffer = {
            get: async(cid) => {return block},
            remove: cid => {}
        }
        const removeOnGet = createRemoveOnGet(peerBlockBuffer)

        // Act
        const resolvedBlock = await removeOnGet(cid)

        // Assert
        assert.strictEqual(resolvedBlock, block)
    })

    it('get removes block', async () => {
        // Arrange
        let removed = false
        const peerBlockBuffer = {
            get: async(cid) => {return block},
            remove: cid => {removed = true}
        }
        const removeOnGet = createRemoveOnGet(peerBlockBuffer)

        // Act
        await removeOnGet(cid)

        // Assert
        assert.strictEqual(removed, true)
    })

    it('get propogates reject', async () => {
        // Arrange
        const peerBlockBuffer = {
            get: (cid) => {
                return Promise.reject()
            },
            remove: cid => {}
        }
        const removeOnGet = createRemoveOnGet(peerBlockBuffer)

        // Act
        const actual = removeOnGet(cid)
        
        // Assert
        assert.rejects(actual)
    })

    it('reject does not remove', async() => {
        // Arrange
        let removed = false
        const peerBlockBuffer = {
            get: function (cid) {
                return Promise.reject()
            },
            remove: cid => {removed = true}
        }
        const removeOnGet = createRemoveOnGet(peerBlockBuffer)

        // Act
        removeOnGet(cid).catch(() => {})

        // Assert
        assert.strictEqual(removed, false)
    })
})