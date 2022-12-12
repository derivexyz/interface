import { Contract } from 'ethers'

import mainnetProvider from './mainnetProvider'

const REVERSE_RESOLVER_ABI = [
  {
    inputs: [{ internalType: 'contract ENS', name: '_ens', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [{ internalType: 'address[]', name: 'addresses', type: 'address[]' }],
    name: 'getNames',
    outputs: [{ internalType: 'string[]', name: 'r', type: 'string[]' }],
    stateMutability: 'view',
    type: 'function',
  },
]

const REVERSE_RESOLVER_ADDRESS = '0x3671aE578E63FdF66ad4F3E12CC0c0d71Ac7510C'

export default async function fetchENSNames(addresses: string[]): Promise<string[]> {
  const contract = new Contract(REVERSE_RESOLVER_ADDRESS, REVERSE_RESOLVER_ABI, mainnetProvider)
  return await contract.getNames(addresses)
}
