const bitcoin = require('bitcoinjs-lib')
const {hexLength, lenPrefixedHex, ops} = require('./util')

var addr = 'mh8tGnF6RCsnWUMTw1WL9UWjjgyMRRTM8t'
var wif = 'cT8gHG8a3gHPBDDLve4A6SKUjTQwNnJ3A3oGjzrqZmXGQJ7dfmQ6'
var txid = 'b1c5d5a3ff0d0c23cf9ee42e34c60888dc699ef26b516855468f2dd7e5cc73a5'
var txOutput = 0
var amount = 123600000

var keyPair = bitcoin.ECPair.fromWIF(wif, bitcoin.networks.testnet);

var tx = new bitcoin.TransactionBuilder(bitcoin.networks.testnet)
tx.addInput(txid, txOutput)

// decode the b58check encoded address to hex
HASH160 = bitcoin.address.fromBase58Check(addr).hash.toString('hex')

// form the redeem script in hex
// its just a simple p2pkh
redeemScriptHex = ops.OP_DUP + ops.OP_HASH160 + lenPrefixedHex(HASH160) + ops.OP_EQUALVERIFY + ops.OP_CHECKSIG
redeemScript =  new Buffer(redeemScriptHex, "hex")
scriptHash = bitcoin.crypto.hash160(redeemScript).toString('hex')


scriptPubKeyHex = ops.OP_HASH160 + lenPrefixedHex(scriptHash) + ops.OP_EQUAL
scriptPubKey = new Buffer(scriptPubKeyHex, "hex")


// note we call addOutput on the inner tx, which takes a scriptPubKey rather than just an addr
tx.addOutput(addr, amount-1000) // test 
tx.tx.addOutput(scriptPubKey, 1000)
tx.sign(0, keyPair);

console.log("---------- TRANSACTION HEX ---------")
console.log("")
console.log(tx.build().toHex());
console.log("")


txid = tx.build().getId()
txOutput = 1
amount = 1

// now create a tx to spend it with the new txid and txOutput
tx = new bitcoin.TransactionBuilder(bitcoin.networks.testnet)
tx.addInput(txid, txOutput)
tx.addOutput(addr, amount)
tx.sign(0, keyPair, redeemScript) //redeemScript)
sig = tx.inputs[0].signatures[0].toString('hex')
pubHex = keyPair.getPublicKeyBuffer().toString('hex')

var scriptSigHex = lenPrefixedHex(sig) + lenPrefixedHex(pubHex) + lenPrefixedHex(redeemScriptHex) 

let builtTx = tx.build()

builtTx.ins[0].script = new Buffer(scriptSigHex, "hex")


console.log("---------- TRANSACTION HEX ---------")
console.log("")
console.log(builtTx.toHex());

