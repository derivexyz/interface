# Kwenta Options Interface

An open source interface for the Lyra Protocol, a decentralized options exchange built on Optimistic Ethereum.

## Accessing the Kwenta Options Interface

To access the Kwenta Options Interface, use an IPFS gateway link from the [latest release](https://github.com/Kwenta/lyra-interface/releases/latest) or visit [options.kwenta.eth.limo](https://options.kwenta.eth.limo).

## Contributions

The Kwenta Options Interface is open source, permissionless software that can be developed and hosted by anyone. Thanks in advance for your contributions! Contributors should fork this repository and submit pull requests against the `kwenta/lyra-interface:dev` branch.

The `master` branch will be regularly synchronized in line with changes incoming from the `lyra-finance/interface:master` branch by the devDAO PM. 

Once changes in the `dev` branch have been thoroughly tested and approved, new releases to the Kwenta-hosted Lyra frontend will be pushed to the `deploy` branch.

### Setup

```
yarn install
```

### Run the interface locally

```
yarn start
```

### Create a production build

```
yarn build
```