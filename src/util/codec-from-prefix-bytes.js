const multicodec = require('multicodec')

// based on https://github.com/multiformats/js-cid/blob/master/src/index.js#L104

const codecFromPrefixBytes = (prefixBytes) => {
    const firstByte = prefixBytes.slice(0, 1)
    const v = parseInt(firstByte.toString('hex'), 16)
    if (v === 1) {
      return multicodec.getCodec(prefixBytes.slice(1))
    } else {
      // v0 is always dag-pb
      return 'dag-pb'
    }   
}

module.exports = codecFromPrefixBytes