const multiaddr = require('multiaddr')

const create = () => {
    return {
        dialProtocol: async(peer, protocols, options) => {
            const stream = {}
            const protocol = {}
            return {stream, protocol}
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