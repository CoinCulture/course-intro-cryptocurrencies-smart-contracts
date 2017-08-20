const bitcoin = require('bitcoinjs-lib')
const {hexLength, lenPrefixedHex, ops} = require('./util')

var addr = 'mh8tGnF6RCsnWUMTw1WL9UWjjgyMRRTM8t'
var wif = 'cT8gHG8a3gHPBDDLve4A6SKUjTQwNnJ3A3oGjzrqZmXGQJ7dfmQ6'
var txid = '724ce1ecb1e865f8d9e74b8b4060f55e41994e88f2120ccdcc9b5793e8f364e4'
var txOutput = 0
var amount = 123800000

var keyPair = bitcoin.ECPair.fromWIF(wif, bitcoin.networks.testnet);
var keyPair2 = bitcoin.ECPair.fromWIF('cTCtFzdHgkWbbRy8tmth4aPLrNkEaTUvYYjHtyDwUViJ9CJg8WG9', bitcoin.networks.testnet);

var tx = new bitcoin.TransactionBuilder(bitcoin.networks.testnet)
tx.addInput(txid, txOutput)

// decode the b58check encoded address to hex
HASH160 = bitcoin.address.fromBase58Check(addr).hash.toString('hex')

// form the redeem script in hex. its a 2 of 2 multisig
// we can just use the multisig lib function, but lets do it the hardway instead :)
// redeemScript = bitcoin.script.multisig.output.encode(2, [keyPair.getPublicKeyBuffer(), keyPair2.getPublicKeyBuffer()])
// redeemScriptHex = redeemScript.toString('hex')
pubKey1 = keyPair.getPublicKeyBuffer().toString('hex')
pubKey2 = keyPair2.getPublicKeyBuffer().toString('hex')
redeemScriptHex = ops.OP_2 + lenPrefixedHex(pubKey1) + lenPrefixedHex(pubKey2) + ops.OP_2 + ops.OP_CHECKMULTISIG
redeemScript = new Buffer(redeemScriptHex, "hex")

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
tx.sign(0, keyPair, redeemScript) 
tx.sign(0, keyPair2, redeemScript) 
sig1 = tx.inputs[0].signatures[0].toString('hex')
sig2 = tx.inputs[0].signatures[1].toString('hex')

var scriptSigHex = '00' + lenPrefixedHex(sig1) + lenPrefixedHex(sig2) +  lenPrefixedHex(redeemScriptHex) 

let builtTx = tx.build()

builtTx.ins[0].script = new Buffer(scriptSigHex, "hex")

console.log("---------- TRANSACTION HEX ---------")
console.log("")
console.log(builtTx.toHex());

