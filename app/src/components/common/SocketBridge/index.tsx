import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import useThemeColor from '@lyra/ui/hooks/useThemeColor'
import { Chain } from '@lyrafinance/lyra-js'
import { Currency, Network } from '@socket.tech/plugin'
import { providers } from 'ethers'
import React from 'react'
import { SWRConfig } from 'swr'
import { useSigner } from 'wagmi'

import { LogEvent } from '@/app/constants/logEvents'
import { NETWORK_CONFIGS } from '@/app/constants/networks'
import { SOCKET_NATIVE_TOKEN_ADDRESS } from '@/app/constants/token'
import hexToRGB from '@/app/utils/hexToRGB'
import logEvent from '@/app/utils/logEvent'

const DEFAULT_WIDTH = 500
const DEFAULT_MOBILE_WIDTH = 300

type Props = {
  defaultSourceToken?: string
  defaultDestToken?: string
  defaultSourceNetwork?: number
  defaultDestNetwork?: number
  title?: string
  enableRefuel?: boolean
  enableSameChainSwaps?: boolean
}

type SocketCustomizationProps = {
  width?: number // Width of the widget in px
  responsiveWidth?: boolean // Widget is responsive relative to the parent element
  borderRadius?: number // Radius of all borders in widget, takes values between 0 - 1
  accent?: string // Background color of buttons
  onAccent?: string // Color of text in buttons
  primary?: string // Background color of widget and modals
  secondary?: string // Foreground color of info section, hover hightlights, cards
  text?: string // Color of all text, headings and emphasised font on widget
  secondaryText?: string // Color of labels, icons, footer text on widget
  interactive?: string // Background color of dropdown elements
  onInteractive?: string // Color of text in dropdowns
  outline?: string // Outline color of lines, borders and icons
}

const SocketPlugin = React.lazy(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  () => import('@socket.tech/plugin').then(module => ({ default: module.Bridge }))
)

const SocketBridge = ({
  title = 'Swap or Bridge',
  defaultSourceToken = SOCKET_NATIVE_TOKEN_ADDRESS,
  defaultDestToken,
  defaultSourceNetwork = NETWORK_CONFIGS[Chain.Optimism].chainId,
  defaultDestNetwork = NETWORK_CONFIGS[Chain.Optimism].chainId,
  enableRefuel = true,
}: Props): JSX.Element => {
  const isMobile = useIsMobile()
  const { data: signer } = useSigner({ suspense: true })
  const web3Provider = signer?.provider && new providers.Web3Provider((signer?.provider as any).provider)

  const background = hexToRGB(useThemeColor('background'))
  const modalBg = hexToRGB(useThemeColor('modalBg'))
  const text = hexToRGB(useThemeColor('text'))
  const primaryButtonBg = hexToRGB(useThemeColor('primaryButtonBg'))

  const customize: SocketCustomizationProps = {
    width: isMobile ? DEFAULT_MOBILE_WIDTH : DEFAULT_WIDTH,
    borderRadius: 1,
    responsiveWidth: true,
    accent: `rgb(${primaryButtonBg.r},${primaryButtonBg.g},${primaryButtonBg.b})`,
    onAccent: `rgb(${text.r},${text.g},${text.b})`,
    primary: `rgb(${background.r},${background.g},${background.b})`,
    secondary: `rgb(${modalBg.r},${modalBg.g},${modalBg.b})`,
    text: `rgb(${text.r},${text.g},${text.b})`,
    secondaryText: `rgb(${text.r},${text.g},${text.b})`,
    interactive: `rgb(${background.r},${background.g},${background.b})`,
    onInteractive: `rgb(${text.r},${text.g},${text.b})`,
  }
  return (
    <SWRConfig value={{ suspense: false }}>
      {web3Provider && (
        <SocketPlugin
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          provider={web3Provider}
          API_KEY={process.env.REACT_APP_SOCKET_API_KEY ?? ''}
          customize={customize}
          enableSameChainSwaps={true}
          defaultSourceNetwork={defaultSourceNetwork}
          defaultDestNetwork={defaultDestNetwork}
          defaultSourceToken={defaultSourceToken}
          defaultDestToken={defaultDestToken}
          enableRefuel={enableRefuel}
          title={title}
          includeBridges={['hop', 'optimism-bridge']} // TODO: @dillonlin ask Socket guys to export types
          onBridgeSuccess={(data: any) => {
            logEvent(LogEvent.SocketBridgeSuccess, { ...data })
          }}
          onSourceNetworkChange={(network: Network) => {
            logEvent(LogEvent.SocketSourceNetworkChange, { ...network })
          }}
          onDestinationNetworkChange={(network: Network) => {
            logEvent(LogEvent.SocketDestinationNetworkChange, { ...network })
          }}
          onSourceTokenChange={(currency: Currency) => {
            logEvent(LogEvent.SocketSourceTokenChange, { ...currency })
          }}
          onDestinationTokenChange={(currency: Currency) => {
            logEvent(LogEvent.SocketDestinationTokenChange, { ...currency })
          }}
          onError={(data: any) => {
            logEvent(LogEvent.SocketError, { ...data })
          }}
          onSubmit={(data: any) => {
            logEvent(LogEvent.SocketSubmit, { ...data })
          }}
        />
      )}
    </SWRConfig>
  )
}

export default SocketBridge
