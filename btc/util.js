const ops = require('bitcoin-ops')

var hexOps = {}

Object.keys(ops).map(function(key, index) {
	hexOps[key] = ops[key].toString('16')	
});

function hexLength(s) {
  len = s.length / 2
  return len.toString(16)
}

function lenPrefixedHex(s) {
	return hexLength(s) + s
}

// returns scriptPubKey Buffer for p2pkh
function p2pkh(addr) {
 	scriptPubKeyHex = hexOps.OP_DUP + hexOps.OP_HASH160 + lenPrefixedHex(addr) + hexOps.OP_EQUALVERIFY + hexOps.OP_CHECKSIG
  	scriptPubKey =  new Buffer(scriptPubKeyHex, "hex")
	return scriptPubKey
}

module.exports = {
	hexLength: hexLength,
	lenPrefixedHex: lenPrefixedHex,
	ops: hexOps,
	p2pkh: p2pkh
}

