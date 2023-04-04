# Lyra Interface

An open source interface for the Lyra Protocol, a decentralized options exchange built on Optimistic Ethereum.

## Accessing the Lyra Interface

To access the Lyra Interface, use an IPFS gateway link from the [latest release](https://github.com/lyra-finance/interface/releases/latest) or visit [app.lyra.finance](https://app.lyra.finance).

## Contributions

The Lyra Interface is open source, permissionless software that can be developed and hosted by anyone. Thanks in advance for your contributions!

### Setup

Install app dependencies:

```
yarn install
```

Create local environment variables:

```
cp app/.env app/.env.local
```

Setup an RPC for the supported networks and testnets:

```
# .env.local
REACT_APP_OPTIMISM_MAINNET_RPC_URL=
REACT_APP_OPTIMISM_GOERLI_RPC_URL=
REACT_APP_ARBITRUM_MAINNET_RPC_URL=
REACT_APP_ARBITRUM_GOERLI_RPC_URL=
REACT_APP_ETHEREUM_MAINNET_RPC_URL=
REACT_APP_ETHEREUM_GOERLI_RPC_URL=
```

### Run the interface locally

```
yarn start
```

### Create a production build

```
yarn build
```
