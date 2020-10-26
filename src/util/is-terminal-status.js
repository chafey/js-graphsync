// https://github.com/ipld/specs/blob/master/block-layer/graphsync/graphsync.md#response-status-codes

const isTerminalStatus = (status) => {
    return status >= 20
}

module.exports = isTerminalStatus