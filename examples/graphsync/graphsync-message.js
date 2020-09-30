const protons = require('protons')
const fs = require('fs')
const graphsyncMessage = protons(fs.readFileSync('../../src/message/pb/message.proto'))

module.exports = graphsyncMessage