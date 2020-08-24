const init = () => {
    console.log("Initializing...")
}

const request = async (context, root, selector) => {
    // returns a progress object
    return {
        complete: async () => { }
    }
}

const newGraphSync = async (network, loader, storer) => {
    return {
        request
    }
}

module.exports = {
    init,
    new: newGraphSync
}