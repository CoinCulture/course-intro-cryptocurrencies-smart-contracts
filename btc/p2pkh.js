const bitcoin = require('bitcoinjs-lib')


var addr = 'mh8tGnF6RCsnWUMTw1WL9UWjjgyMRRTM8t'
var wif = 'cPpM64Hjw3nfqFwSayLgX4uwbd4RLvojBA5yc13fStXJdE1khjyZ'
var txid = '740094326cdcc3c8bd9ca260d26d72e401878737465facccc94b65b2aaf4f597'
var txOutput = 1
var amount = 128000000

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
