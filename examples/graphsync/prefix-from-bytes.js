const multicodec = require('multicodec')

// BUG: I stole this code from somewhere but it doesn't work properly, need to find new implementation or write from scratch

prefixFromBytes = (bytes) => {
    const firstByte = bytes.slice(0, 1)
    const v = parseInt(bytes.toString('hex'), 16)
    console.log('v=', v)
    if (v === 1) {
      // version is a CID Uint8Array
      const cid = bytes
      return {
          version: v,
          codec: multicodec.getCodec(cid.slice(1)),
          multihash: multicodec.rmPrefix(cid.slice(1)),
          multibaseName: 'base32'
      } 
    } else {
      // version is a raw multihash Uint8Array, so v0
      return {
        version: 0,
        codec: 'dag-pb',
        multihash: bytes,
        multibaseName: 'base58btc'
        } 
    }   
}

module.exports = prefixFromBytes