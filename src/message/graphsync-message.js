const protons = require('protons')
const fs = require('fs')
const path = require('path')
const graphsyncMessage = protons(fs.readFileSync(path.resolve(__dirname, 'message.proto')))

module.exports = graphsyncMessage