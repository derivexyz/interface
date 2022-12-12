import Box from '@lyra/ui/components/Box'
import Button from '@lyra/ui/components/Button'
import Flex from '@lyra/ui/components/Flex'
import Grid from '@lyra/ui/components/Grid'
import Image from '@lyra/ui/components/Image'
import Text from '@lyra/ui/components/Text'
import React from 'react'

import {
  BINANCE_URL,
  BITGET_URL,
  CRYPTO_URL,
  GATE_IO_URL,
  HUOBI_URL,
  JUNO_FINANCE_URL,
  KUCOIN_URL,
} from '@/app/constants/links'
import getAssetSrc from '@/app/utils/getAssetSrc'

const DEFAULT_EXCHANGES = [
  {
    label: 'Binance',
    href: BINANCE_URL,
    src: '/images/binance-logo.png',
  },
  {
    label: 'Crypto.com',
    href: CRYPTO_URL,
    src: '/images/crypto.com-logo.png',
  },
  {
    label: 'KuCoin',
    href: KUCOIN_URL,
    src: '/images/kucoin-logo.png',
  },
  {
    label: 'Juno Finance',
    href: JUNO_FINANCE_URL,
    src: '/images/juno-logo.png',
  },
  {
    label: 'HuoBi',
    href: HUOBI_URL,
    src: '/images/huobi-logo.png',
  },
  {
    label: 'Gate IO',
    href: GATE_IO_URL,
    src: '/images/gate.io-logo.png',
  },
  {
    label: 'BitGet',
    href: BITGET_URL,
    src: '/images/bitget-logo.png',
  },
]

export default function OnboardingModalExchangeGrid(): JSX.Element {
  return (
    <Flex flexDirection="column" width="100%">
      <Text variant="heading2" color="text" mb={6}>
        Compatible Exchanges
      </Text>
      <Text variant="secondary" color="secondaryText" mb={6}>
        Transfer ETH to Optimism from centralized exchanges.
      </Text>
      <Grid sx={{ gridTemplateColumns: ['1fr', '1fr 1fr'], gap: 4 }}>
        {DEFAULT_EXCHANGES.map((exchange, idx) => {
          return (
            <Box key={idx}>
              <Button
                leftIcon={<Image src={getAssetSrc(exchange.src)} size={30} />}
                size="lg"
                variant="light"
                px={6}
                justify="left"
                label={exchange.label}
                href={exchange.href}
                target="_blank"
              />
            </Box>
          )
        })}
      </Grid>
    </Flex>
  )
}
