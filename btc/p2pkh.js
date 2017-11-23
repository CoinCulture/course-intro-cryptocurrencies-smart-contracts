const bitcoin = require('bitcoinjs-lib')


var addr = 'mh8tGnF6RCsnWUMTw1WL9UWjjgyMRRTM8t'
var wif = 'cT8gHG8a3gHPBDDLve4A6SKUjTQwNnJ3A3oGjzrqZmXGQJ7dfmQ6'
var txid = '09aeab096126f5fd122e83ae393977ba6e97f1d700928a0d6d53ddfe8a0e28ea'
var txOutput = 42
var amount = 530300000

var keyPair = bitcoin.ECPair.fromWIF(wif, bitcoin.networks.testnet);

let tx = new bitcoin.TransactionBuilder(bitcoin.networks.testnet)

tx.addInput(txid, txOutput)
tx.addOutput(addr, amount)
tx.sign(0, keyPair);


console.log("---------- TRANSACTION STRUCTURE ---------")
console.log("")
console.log(tx.build())
console.log("")
console.log("---------- TRANSACTION HEX ---------")
console.log("")
console.log(tx.build().toHex());
