/**
 * A blockBuffer allows asynchronous block delivery from a producer to a consumer.  It has the following features:
 * - consumer can request a block before it has been produced and it will be delivered once the block is produced
 * - producer can deliver a block before it has been consumed and the block will be delivered later when it is consumed
 * - producer can be notified once a block it has produced has been delievered to a consumer
 * - all pending promises returned to consumers and producers can be rejected (for error handling/cleanup use case)
 */

const createBlockBuffer = () => {
    const blockBuffers = {} // map of cids to corresponding blockBuffer objects

    const getOrCreateBlockBuffer = (cid) => {
        const cidAsString = cid.toString()
        const existingBlockBuffer = blockBuffers[cidAsString]
        if(existingBlockBuffer) {
            return existingBlockBuffer
        }
        const newBlockBuffer = {
            pendingGet: false, // true if a get is pending, false if not
            pendingPut: false,// true if a block has been put
            putBlock: undefined // the block that was put, or undefined if not put yet
        }
        const promise = new Promise((resolve, reject) => {
            newBlockBuffer.resolve = resolve
            newBlockBuffer.reject = reject
        }).finally(() => {
            // remove the block once it has been consumed (or rejected)
            delete blockBuffers[cidAsString]
        })
        newBlockBuffer.promise = promise
        blockBuffers[cidAsString] = newBlockBuffer
        return newBlockBuffer
    }

    return {
        /**
         * Puts a block into the buffer which is forwarded to any pending gets or if no pending gets,
         * held until get is called in the future and then immediately forwarded to the get.  
         * 
         * Note: Once the block is forwarded it is removed from the buffer
         * Note: put overwrites existing blocks that have not yet been forwarded
         * 
         * Returns a promise that resolves to the block once it is forwarded
         */
        put: (cid, block) => {
            const blockBuffer = getOrCreateBlockBuffer(cid)
            if(blockBuffer.pendingGet) {
                blockBuffer.resolve(block)
            } else {
                blockBuffer.pendingPut = true // set to true
                blockBuffer.putBlock = block // note - overwrites existing putBlock if present, can be undefined!
            }
            return blockBuffer.promise
        },
        /**
         * Returns a promise that resolves to a block.  If the block was already put, it is resolved immediately
         */
        get: (cid) => {
            const blockBuffer = getOrCreateBlockBuffer(cid)
            if(blockBuffer.pendingPut) {
                blockBuffer.resolve(blockBuffer.putBlock)
            } else {
                blockBuffer.pendingGet = true
            }
            return blockBuffer.promise
        },
        /**
         * Rejects all unresolved promises returned by get and put.
         * Returns a promise that resolves once all promises have settled
         */
        rejectAll: async () => {
            const promises = []
            for(const key in blockBuffers) {
                const blockBuffer = blockBuffers[key]
                promises.push(blockBuffer.promise)
                blockBuffer.reject()
            }
            await Promise.allSettled(promises)
        }
    }
}
module.exports = createBlockBuffer