
const createRequestValidator = (rootCID, selector, blockGet) => {

    const depthFirstTraversal = async (cid, depthLimit) => {

        if (depthLimit <= 0) return []

        const block = await blockGet(cid)

        if(block) {
            for (const [path, link] of block.reader().links()) {
                const nodes = path.split('/').length
                await depthFirstTraversal(link, depthLimit - nodes)
            }
        }
    }

    return depthFirstTraversal(rootCID, 100)
}

module.exports = createRequestValidator