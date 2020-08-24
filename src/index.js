const init = () => {
    console.log("Initializing...")
}

const request = async (context, root, selector) => {
    // TODO: create request message
    // TODO: create handler for messages sent by responder
    // TODO: send request message to responder over network
    // return progress object
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