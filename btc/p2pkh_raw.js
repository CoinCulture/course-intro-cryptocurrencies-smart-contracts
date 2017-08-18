const bitcoin = require('bitcoinjs-lib')

var addr = 'msMgWGsQP5NpHs8WLpSjHvqtHu8hDmJcK3'
var wif = 'cSfkvBMC9jufxA9bMKfKgnBkofG4njheRnrj148HMDJoiUumuGs1'
var txid = '9dbf51db1b575b58d200335908d1e69dd820dca5b6956b6a6edcf1cfbe61904f'
var txOutput = 0
var amount = 129800000

var OP_DUP = '76'
var OP_HASH160 = 'A9'
var N_BYTES = '14' // in hex this is 20
var OP_EQUALVERIFY = '88'
var OP_CHECKSIG = 'AC'


var keyPair = bitcoin.ECPair.fromWIF(wif, bitcoin.networks.testnet);

let tx = new bitcoin.TransactionBuilder(bitcoin.networks.testnet)

// form the scriptSig in hex

// build the raw input
// note we call addInput on the inner tx, which takes a (hash, index, sequence, scriptSig) rather than just a hash and index
//tx.addInput(txid, txOutput)
tx.addInput(txid, txOutput, null, null) 

// decode the b58check encoded address to hex
HASH160 = bitcoin.address.fromBase58Check(addr).hash.toString('hex')

// form the scriptPubKey in hex
scriptPubKeyHex = OP_DUP + OP_HASH160 + N_BYTES + HASH160 + OP_EQUALVERIFY + OP_CHECKSIG
scriptPubKey =  new Buffer(scriptPubKeyHex, "hex")

// note we call addOutput on the inner tx, which takes a scriptPubKey rather than just an addr
// tx.addOutput(addr, amount)
tx.tx.addOutput(scriptPubKey, amount)

tx.sign(0, keyPair);

console.log("---------- TRANSACTION STRUCTURE ---------")
console.log("")
console.log(tx.build())
console.log("")
console.log("---------- TRANSACTION HEX ---------")
console.log("")
console.log(tx.build().toHex());


console.log("-----")
console.log(tx.build().ins[0].script.toString('hex'))
console.log("-----")
console.log(keyPair.getPublicKeyBuffer())
