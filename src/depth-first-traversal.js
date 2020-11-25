/**
 * Performs a depth first traversal 
 * @param {*} cid 
 * @param {*} depthLimit 
 * @param {*} blockGet 
 */
const depthFirstTraversal = async (cid, depthLimit, blockGet) => {

    if (depthLimit <= 0) return []

    const block = await blockGet(cid)

    if(block) {
        for (const [path, link] of block.reader().links()) {
            const nodes = path.split('/').length
            await depthFirstTraversal(link, depthLimit - nodes, blockGet)
        }
    }
}

module.exports = depthFirstTraversal