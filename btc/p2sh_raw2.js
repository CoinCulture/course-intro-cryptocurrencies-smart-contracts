const bitcoin = require('bitcoinjs-lib')

var addr = 'mh8tGnF6RCsnWUMTw1WL9UWjjgyMRRTM8t'
var wif = 'cT8gHG8a3gHPBDDLve4A6SKUjTQwNnJ3A3oGjzrqZmXGQJ7dfmQ6'
var txid = 'f5b51806b633970d299ccf5301f0f0b8f50ad06494750bb63507a6f86920318e'
var txOutput = 0
var amount = 124000000

var OP_DUP = '76'

var OP_HASH160 = 'A9'
var OP_CHECKSIG = 'AC'

var OP_EQUAL = '87'
var OP_EQUALVERIFY = '88'

var keyPair = bitcoin.ECPair.fromWIF(wif, bitcoin.networks.testnet);

var tx = new bitcoin.TransactionBuilder(bitcoin.networks.testnet)
tx.addInput(txid, txOutput)

// decode the b58check encoded address to hex
HASH160 = bitcoin.address.fromBase58Check(addr).hash.toString('hex')

// form the redeem script in hex
// its just a simple p2pkh

function hexLength(s) {
  len = s.length / 2
  return len.toString(16)
}

redeemScriptHex = OP_DUP + OP_HASH160 + hexLength(HASH160) + HASH160 + OP_EQUALVERIFY + OP_CHECKSIG
redeemScript =  new Buffer(redeemScriptHex, "hex")
scriptHash = bitcoin.crypto.hash160(redeemScript).toString('hex')


scriptPubKeyHex = OP_HASH160 + hexLength(scriptHash) + scriptHash + OP_EQUAL
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

var scriptSigHex = hexLength(sig) + sig + hexLength(pubHex) + pubHex + hexLength(redeemScriptHex) + redeemScriptHex

let builtTx = tx.build()

builtTx.ins[0].script = new Buffer(scriptSigHex, "hex")


console.log("---------- TRANSACTION HEX ---------")
console.log("")
console.log(builtTx.toHex());

