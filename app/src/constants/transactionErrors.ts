import { ErrorDescription } from '@ethersproject/abi/lib/interface'

export type TransactionError = {
  code?: number
  message?: string
  data?: any
  description?: ErrorDescription | null
  reason?: TransactionErrorReason
  rawError: any
}

export enum TransactionErrorStage {
  GasEstimate = 'GasEstimate',
  Wallet = 'Wallet',
  Reverted = 'Reverted',
}

export enum TransactionErrorReason {
  NotEnoughFunds = 'NotEnoughFunds',
  UserDenied = 'UserDenied',
  NetworkChanged = 'NetworkChanged',
  RpcError = 'RpcError',
  TradeSlippage = 'TradeSlippage',
  WalletSetup = 'WalletSetup',
}

// Catches common error patterns
export const TX_ERROR_PATTERNS: Record<
  TransactionErrorReason,
  { message?: string; code?: number | string; name?: string }[]
> = {
  [TransactionErrorReason.TradeSlippage]: [
    { message: 'Insufficient balance after any settlement owing' },
    { name: 'TotalCostOutsideOfSpecifiedBounds' },
  ],
  [TransactionErrorReason.UserDenied]: [
    { message: 'User denied transaction signature' },
    { message: 'User rejected' },
    { message: 'Reject by the user' },
    { message: "Cannot set properties of undefined (setting 'loadingDefaults')" },
    { message: 'Sign request rejected by user' },
    { message: 'Canceled' },
    { message: 'Cancelled' },
    { message: 'Error: Cancelled' },
    { message: 'Action cancelled by user' },
    { message: 'Error: Interaction timeout' },
    { message: 'Error: Popup closed' },
    { message: 'Request rejected' },
    { code: 'ACTION_REJECTED' },
    { code: 4001 },
  ],
  [TransactionErrorReason.NotEnoughFunds]: [
    { message: 'Not enough funds for gas' },
    { message: 'Failed to execute call with revert code InsufficientGasFunds' },
    { message: 'execution reverted: ERC20: transfer amount exceeds balance' },
  ],
  [TransactionErrorReason.WalletSetup]: [
    { message: 'Manifest not set. Read more at https://github.com/trezor/connect/blob/develop/docs/index.md' },
    {
      message: 'U2F browser support is needed for Ledger. Please use Chrome, Opera or Firefox with a U2F extension.',
    },
    { message: 'Error: device disconnected during action' },
    { message: 'Error: Device is used in another window' },
    { message: 'Error: Device not found' },
    { message: "Error: Failed to execute 'transferIn' on 'USBDevice': A transfer error has occurred." },
    { message: 'Error: Initialize failed: device disconnected during action, code: undefined' },
    { message: "Error: Initialize failed: Didn't receive expected header signature., code: undefined" },
    { message: 'Error: session not found' },
    { message: 'Error: wrong previous session' },
    { message: 'Failed to sign with Ledger device: U2F DEVICE_INELIGIBLE' },
    { message: 'Failed to sign with Ledger device: U2F OTHER_ERROR' },
    { message: 'Ledger device:' },
    { message: 'Ledger:' },
    { message: 'LEDGER_WRONG_APP' },
    { message: 'MetaMask is having trouble connecting to the network' },
    { message: 'nonce too low' },
    { message: 'nonce has already been used' },
    { message: 'Please enable Blind signing or Contract data in the Ethereum app Settings' },
    {
      message:
        "Failed to execute 'requestDevice' on 'HID': Must be handling a user gesture to show a permission request.",
    },
    {
      message: 'An error while signing the transaction ocurred',
    },
  ],
  [TransactionErrorReason.NetworkChanged]: [{ message: 'Underlying network changed' }],
  [TransactionErrorReason.RpcError]: [
    // @see https://eips.ethereum.org/EIPS/eip-1474#error-codes
    { code: -32005 },
    { message: 'Non-200 status code' },
    { message: 'Request limit exceeded' },
    { message: 'Internal json-rpc error' },
    { message: 'Response has no error or result' },
    { message: "We can't execute this request" },
    { message: "Couldn't connect to the network" },
  ],
}
