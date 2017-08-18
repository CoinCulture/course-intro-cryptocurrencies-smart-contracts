const bitcoin = require('bitcoinjs-lib')

var addr = 'mh8tGnF6RCsnWUMTw1WL9UWjjgyMRRTM8t'
var wif = 'cT8gHG8a3gHPBDDLve4A6SKUjTQwNnJ3A3oGjzrqZmXGQJ7dfmQ6'
var txid = '2c07582a05ddda63713b06e94682718c77c8ce0d69cf1e9dfe92d04422b8f574'
var txOutput = 0
var amount = 125000000

var OP_DUP = '76'

var OP_HASH160 = 'A9'
var OP_CHECKSIG = 'AC'

var OP_EQUAL = '87'
var OP_EQUALVERIFY = '88'

var OP_CHECKMULTISIG = 'ae'

var OP_1 = '51'


var keyPair = bitcoin.ECPair.fromWIF(wif, bitcoin.networks.testnet);

var tx = new bitcoin.TransactionBuilder(bitcoin.networks.testnet)
tx.addInput(txid, txOutput)

// decode the b58check encoded address to hex
HASH160 = bitcoin.address.fromBase58Check(addr).hash.toString('hex')

// form the redeem script in hex
// its just a simple p2pkh
redeemScript = bitcoin.script.multisig.output.encode(1, [keyPair.getPublicKeyBuffer()])
redeemScriptHex = redeemScript.toString('hex')
scriptHash = bitcoin.crypto.hash160(redeemScript).toString('hex')

function hexLength(s) {
  len = s.length / 2
  return len.toString(16)
}


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

var scriptSigHex = '00' + hexLength(sig) + sig  + hexLength(redeemScriptHex) + redeemScriptHex

let builtTx = tx.build()

builtTx.ins[0].script = new Buffer(scriptSigHex, "hex")

console.log("---------- TRANSACTION HEX ---------")
console.log("")
console.log(builtTx.toHex());

