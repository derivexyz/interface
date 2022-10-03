import Box from '@lyra/ui/components/Box'
import Button from '@lyra/ui/components/Button'
import Flex from '@lyra/ui/components/Flex'
import Grid from '@lyra/ui/components/Grid'
import Image from '@lyra/ui/components/Image'
import Text from '@lyra/ui/components/Text'
import React from 'react'

import { BANXA_URL, TRANSAK_URL } from '@/app/constants/links'
import getAssetSrc from '@/app/utils/getAssetSrc'

const DEFAULT_CARDS = [
  {
    label: 'Transak',
    href: TRANSAK_URL,
    src: '/images/transak-logo.png',
  },
  {
    label: 'Banxa',
    href: BANXA_URL,
    src: '/images/banxa-logo.png',
  },
]

export default function OnboardingModalCardGrid(): JSX.Element {
  return (
    <Flex flexDirection="column">
      <Text variant="heading2" color="text" mb={6}>
        Debit or Credit Card
      </Text>
      <Text variant="secondary" color="secondaryText" mb={6}>
        Payment service providers allow you to buy ETH on Optimism with a debit/credit card or Apple Pay.
      </Text>
      <Grid sx={{ gridTemplateColumns: ['1fr', '1fr 1fr'], gap: 4 }}>
        {DEFAULT_CARDS.map((card, idx) => {
          return (
            <Box key={idx}>
              <Button
                leftIcon={<Image src={getAssetSrc(card.src)} size={30} />}
                size="lg"
                variant="light"
                px={6}
                justify="left"
                label={card.label}
                href={card.href}
                target="_blank"
              />
            </Box>
          )
        })}
      </Grid>
    </Flex>
  )
}
