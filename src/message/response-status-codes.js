const infoResponseStatusCodes = [
    {status: 10, description: "Request Acknowledged. Working on it."},
    {status: 11, description: "Additional Peers. PeerIDs in extra."},
    {status: 12, description: "Not enough vespene gas ($)"},
    {status: 13, description: "Other Protocol - info in extra."},
    {status: 14, description: "Partial Response w/ metadata, may include blocks"},
    {status: 15, description: "Request Paused, pending update, see extensions for info"}
]

const successResponseStatusCodes = [
    {status: 20, description: "Request Completed, full content."},
    {status: 21, description: "Request Completed, partial content."}
]

const errorResponseStatusCodes = [
    {status: 30, description: "Request Rejected. NOT working on it."},
    {status: 31, description: "Request failed, busy, try again later (getting dosed. backoff in extra)."},
    {status: 32, description: "Request failed, for unknown reason. Extra may have more info."},
    {status: 33, description: "Request failed, for legal reasons."},
    {status: 34, description: "Request failed, content not found."}
]

allResponseStatusCodes = infoResponseStatusCodes.concat(successResponseStatusCodes.concat(errorResponseStatusCodes))

const getDescription = (status) => {
    for(let i=0; i < allResponseStatusCodes.length; i++) {
        if(allResponseStatusCodes[i].status === status) {
            return allResponseStatusCodes[i].description
        }
    }
    return "unknown response status code " + status
}

module.exports = {
    all: allResponseStatusCodes,
    getDescription: getDescription
}