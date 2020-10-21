const newGraphExchange = require('./graph-exchange')

const init = () => {
    console.log("Initializing...")
}

module.exports = {
    init,
    new: newGraphExchange,
}