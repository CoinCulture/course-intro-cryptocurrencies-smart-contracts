const bitcoin = require('bitcoinjs-lib')


var addr = 'msMgWGsQP5NpHs8WLpSjHvqtHu8hDmJcK3'
var wif = 'cSfkvBMC9jufxA9bMKfKgnBkofG4njheRnrj148HMDJoiUumuGs1'
var txid = '9dbf51db1b575b58d200335908d1e69dd820dca5b6956b6a6edcf1cfbe61904f'
var txOutput = 0
var amount = 129800000

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
