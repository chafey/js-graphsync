const multiaddr = require('multiaddr')
const pushable = require('it-pushable')

const create = () => {
    const outboundData = []
    const inboundStream = pushable()
    let connectionHandler = undefined
    let numberOfDials = 0
    return {
        outboundData,
        numberOfDials,
        start: async() => {},
        dialProtocol: async(peer, protocols, options) => {
            console.log('dialProtocol numberOfDials=',numberOfDials)
            numberOfDials = numberOfDials + 1
            console.log('dialProtocol numberOfDials=',numberOfDials)
            const outboundStream = async (source) => {
                for await (const data of source) {
                    //console.log('stream out bytes of length', data.length)
                    outboundData.push(data)
                }
            }
            // on dial, immediately call the handler to simulate an inbound connection
            const connection = {}
            connectionHandler({connection, stream: inboundStream, protocol:protocols})
            // return the stream to write to and the protocol
            return {stream: outboundStream, protocol: protocols}
        },
        handle: async(protocol, handler) => {
            connectionHandler = handler
        },
        peerStore: {
            addressBook : {
                set: (peerId, multiAddrs) => {
                    //console.log('peerStore.addressBook.set(', peerId, multiAddrs)
                    return {
                        // AddressBook?
                    }
                }
            }
        }
    }
}

module.exports = create