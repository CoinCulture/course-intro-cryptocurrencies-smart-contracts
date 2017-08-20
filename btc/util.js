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

module.exports = {
	hexLength: hexLength,
	lenPrefixedHex: lenPrefixedHex,
	ops: hexOps
}

