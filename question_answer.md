# Cryptography

- Difference between symmetric and asymmetric crypto

	- shared key vs pub/private

- What primitives are not quantum proof

	- anything based on factoring or log hardness assumptions

- What defines a hash?

	- "random oracle" (collision resistant, not-invertible, random)

- When is a Merkle tree useful

	- cheaply prove small chunk is part of big data

- Which hash functions are already broken?


# Distributed Systems

- What's TCP and why.

	- ensure delivery and total order

- synchronous vs asynchronous 

	- LAN vs WAN (roughly)

	- 2/3phase commit vs paxos/raft

	- sync protocol in an async network: atomic clocks

- What is FLP

	- deterministic async consensus is impossible

- Difference between reliable broadcast, atomic broadcast, consensus, state machine replication (SMR)

	- deliver txs, deliver in order, decide on value, decide inputs/state/outputs (built on atomic broadcast)

- What is Byzantine fault tolerance

	- not just crash faults, any behaviour

- What are CRDTs

	- commutative txs so order doesnt matter "as much"

- How to ensure writes to disk are atomic ? 

	- write-ahead-log, fysnc

# Blockchains

- What's new about Bitcoin compared to previous systems ? 

	- Hashcash + B-Money

- How does a bitcoin transaction look/work?

	- inputs, outputs. scriptSig, scriptPubKeyt

- How does an ethereum transaction look/work?

	- nonce, gas, gasprice, to, value, data, sig

- How do light clients / simplified payment verification work?

	- verify headers + merkle proof

- How do light clients differ in PoS

	- only need to track changes to val set, not headers

- What's nothing at stake attack about ? 

- Whats the difference between an on-chain transaction and a payment channel?

	- replicated by all vs private but secured by synchronous access to blockchain

- Whats the difference between an atomic swap and a sidechain?

	- two sided payment channel vs light clients

- What's Tendermint

	- BFT SMR in any language :)

