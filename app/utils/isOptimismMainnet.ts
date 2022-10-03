import { OptimismChainId } from '../constants/networks'
import getOptimismChainId from './getOptimismChainId'

export default function isOptimismMainnet(): boolean {
  return getOptimismChainId() === OptimismChainId.OptimismMainnet
}
