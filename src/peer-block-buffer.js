const createPeerBlockBuffer = (blockStore) => {
    const blockResolvers = {}

    newBlockResolver = (cidAsString) => {
        const blockResolver = {}
        blockResolver.promise = new Promise((resolve, reject) => {
            blockResolver.resolve = resolve
            blockResolver.reject = reject
            blockResolver.finalized = false
        }) 
        blockResolvers[cidAsString] = blockResolver
        blockResolver.promise.finally(() => {
            blockResolver.finalized = true
        })
        return blockResolver
    }

    getBlockResolver = (cid) => {
        const cidAsString = cid.toString()
        const blockResolver = blockResolvers[cidAsString]
        if(!blockResolver) {
            return newBlockResolver(cidAsString)
        } else {
            return blockResolver
        }
    }

    return {
        put: async (cid, block) => {
            const blockResolver = getBlockResolver(cid)
            if(!blockResolver.finalized) {
                blockResolver.resolve(block)
            } else {
                const blockResolver = newBlockResolver(cid.toString())
                blockResolver.resolve(block)
            }
        },
        get: cid => {
            const blockResolver = getBlockResolver(cid)
            return blockResolver.promise.then((block) => {
                delete blockResolvers[cid.toString()]
                return block
            })
        },
        has: cid => {
            const cidAsString = cid.toString()
            return blockResolvers[cidAsString] != undefined
        },
        remove: cid => {
            const cidAsString = cid.toString()
            const blockResolver = blockResolvers[cidAsString]
            if(blockResolver) {
                blockResolver.promise.reject()
                delete blockResolvers[cidAsString]
            }
        },
        /*
        rejectUnresolved: () => {
            for(const key in blockResolvers) {
                const blockResolver = blockResolvers[key]
                blockResolver.reject()
            }
        }*/
    }
}

module.exports = createPeerBlockBuffer