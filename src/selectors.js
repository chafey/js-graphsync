
// Returns the full graph!  Be careful using this as it could return a lot of data, consider
// using a depth!  NOTE: go-ipfs returns an error if you try to use this..
const fullGraph = {
    "R": {
        "l": {
            "none":{}
        }
        ,":>": {
            "a": {
                ">": {
                    "@": {}
                }
            }
        }
    }
}

// Returns the full graph!  Be careful using this as it could return a lot of data, consider
// using a depth!  NOTE: go-ipfs returns an error if depth > 100!
const depthLimitedGraph = {
    "R": {
        "l": {
            "depth":100
        }
        ,":>": {
            "a": {
                ">": {
                    "@": {}
                }
            }
        }
    }
}


module.exports = {
    fullGraph,
    depthLimitedGraph
}