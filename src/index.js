const init = () => {
    console.log("Initializing...")
}

const newGraphSync = async (network, loader, storer) => {
    return {
        request: async () => {
            // returns a progress object
            return {
                complete: async () => { }
            }
        }
    }
}

module.exports = {
    init,
    new: newGraphSync
}