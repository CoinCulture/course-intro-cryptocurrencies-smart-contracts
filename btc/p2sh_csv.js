const bitcoin = require('bitcoinjs-lib')
const {hexLength, lenPrefixedHex, ops, p2pkh } = require('./util')

var addr = 'mh8tGnF6RCsnWUMTw1WL9UWjjgyMRRTM8t'
var wif = 'cT8gHG8a3gHPBDDLve4A6SKUjTQwNnJ3A3oGjzrqZmXGQJ7dfmQ6'
var txid = 'f20cca9a02d68aa993f244dcfba19c817134e8eda10d81009f68f0df7ac38500'
var txOutput = 0
var amount = 119000000

var keyPair = bitcoin.ECPair.fromWIF(wif, bitcoin.networks.testnet);
var keyPair2 = bitcoin.ECPair.fromWIF('cTCtFzdHgkWbbRy8tmth4aPLrNkEaTUvYYjHtyDwUViJ9CJg8WG9', bitcoin.networks.testnet);

// decode the b58check encoded address to hex
HASH160 = bitcoin.address.fromBase58Check(addr).hash.toString('hex')

// form the redeem script in hex. its a 2 of 2 multisig
// we can just use the multisig lib function, but lets do it the hardway instead :)
// redeemScript = bitcoin.script.multisig.output.encode(2, [keyPair.getPublicKeyBuffer(), keyPair2.getPublicKeyBuffer()])
// redeemScriptHex = redeemScript.toString('hex')
pubKey1 = keyPair.getPublicKeyBuffer().toString('hex')
pubKey2 = keyPair2.getPublicKeyBuffer().toString('hex')
redeemScriptHex = ops.OP_2 + lenPrefixedHex(pubKey1) + lenPrefixedHex(pubKey2) + ops.OP_2 + ops.OP_CHECKMULTISIG
p2pkhScriptHex = ops.OP_DUP + ops.OP_HASH160 + lenPrefixedHex(HASH160) + ops.OP_EQUALVERIFY + ops.OP_CHECKSIG
csvScriptHex = ops.OP_3 + ops.OP_CHECKSEQUENCEVERIFY + ops.OP_DROP 
redeemScriptHex = ops.OP_IF + redeemScriptHex + ops.OP_ELSE + csvScriptHex + p2pkhScriptHex + ops.OP_ENDIF
redeemScript = new Buffer(redeemScriptHex, "hex")

scriptHash = bitcoin.crypto.hash160(redeemScript).toString('hex')

scriptPubKeyHex = ops.OP_HASH160 + lenPrefixedHex(scriptHash) + ops.OP_EQUAL
scriptPubKey = new Buffer(scriptPubKeyHex, "hex")

var tx = new bitcoin.Transaction()
txHash = Buffer.from(txid, 'hex').reverse() // txhash is reversed because bitcoin is crazy
tx.addInput(txHash, txOutput, null, null) 
tx.addOutput(p2pkh(HASH160), amount) // test
tx.addOutput(scriptPubKey, 1000)

hashType = bitcoin.Transaction.SIGHASH_ALL
signatureHash = tx.hashForSignature(0, p2pkh(HASH160), hashType)
sig = keyPair.sign(signatureHash).toScriptSignature(hashType)

var scriptSigHex = lenPrefixedHex(sig.toString('hex')) + lenPrefixedHex(pubKey1)
tx.ins[0].script = new Buffer(scriptSigHex, "hex")

console.log("---------- TRANSACTION HEX ---------")
console.log("")
console.log(tx.toHex());
console.log("")


txid = tx.getId()
txOutput = 1
amount = 1

txHash = Buffer.from(txid, 'hex').reverse() // txhash is reversed because bitcoin is crazy

var tx = new bitcoin.Transaction()
tx.addInput(txHash, txOutput, null, null) 
tx.addOutput(p2pkh(HASH160), amount) // test

hashType = bitcoin.Transaction.SIGHASH_ALL
signatureHash = tx.hashForSignature(0, redeemScript, hashType)
sig1 = keyPair.sign(signatureHash).toScriptSignature(hashType).toString('hex')
sig2 = keyPair2.sign(signatureHash).toScriptSignature(hashType).toString('hex')

var scriptSigHex = ops.OP_FALSE + lenPrefixedHex(sig1) + lenPrefixedHex(sig2) + ops.OP_TRUE + ops.OP_PUSHDATA1 + lenPrefixedHex(redeemScriptHex)
tx.ins[0].script = new Buffer(scriptSigHex, "hex")

console.log("---------- TRANSACTION HEX (REDEEM CONDITION 1) ---------")
console.log("")
console.log(tx.toHex());


var tx = new bitcoin.Transaction()
tx.addInput(txHash, txOutput, null, null) 
tx.addOutput(p2pkh(HASH160), amount)
tx.version = 2 // necessary for OP_CHECKSEQUENCEVERIFY
tx.ins[0].sequence = 3
 
hashType = bitcoin.Transaction.SIGHASH_ALL
signatureHash = tx.hashForSignature(0, redeemScript, hashType)
sig1 = keyPair.sign(signatureHash).toScriptSignature(hashType).toString('hex')

var scriptSigHex = lenPrefixedHex(sig1) + lenPrefixedHex(pubKey1) + ops.OP_FALSE + ops.OP_PUSHDATA1 + lenPrefixedHex(redeemScriptHex)
tx.ins[0].script = new Buffer(scriptSigHex, "hex")

console.log("---------- TRANSACTION HEX (REDEEM CONDITION 2) ---------")
console.log("")
console.log(tx.toHex());

