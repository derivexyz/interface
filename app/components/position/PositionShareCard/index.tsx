import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Center from '@lyra/ui/components/Center'
import Icon, { IconType } from '@lyra/ui/components/Icon'
import Text from '@lyra/ui/components/Text'
import useHover from '@lyra/ui/hooks/useHover'
import { MarginProps } from '@lyra/ui/types'
import { Position } from '@lyrafinance/lyra-js'
import copy from 'copy-to-clipboard'
import React, { useState } from 'react'
import styled from 'styled-components'

import { LYRA_SHARE_URL, TWITTER_URL } from '@/app/constants/links'

import PositionShareSVG from '../PositionShareSVG'

type Props = {
  position: Position
} & MarginProps

const SHARE_CARD_SIZE = 350

const CenterFadeIn = styled(Center)`
  @keyframes fadeIn {
    0% {
      opacity: 0%;
    }
    100% {
      opacity: 100%;
    }
  }
`

const PositionShareCard = ({ position, ...marginProps }: Props) => {
  const [ref, isHover] = useHover<HTMLDivElement>()
  const [isCopied, setIsCopied] = useState(false)
  const tradeShareUrl = `${LYRA_SHARE_URL}/p/${position.marketName.toLowerCase()}/${position.id}`
  return (
    <Card
      minWidth={SHARE_CARD_SIZE}
      minHeight={SHARE_CARD_SIZE}
      maxWidth={SHARE_CARD_SIZE}
      maxHeight={SHARE_CARD_SIZE}
      ref={ref}
      {...marginProps}
    >
      <CardBody
        noPadding
        sx={{ position: 'relative' }}
        minWidth={SHARE_CARD_SIZE}
        minHeight={SHARE_CARD_SIZE}
        maxWidth={SHARE_CARD_SIZE}
        maxHeight={SHARE_CARD_SIZE}
      >
        {isHover ? (
          <CenterFadeIn
            bg="tradeShareHoverBg"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              animation: 'fadeIn 0.1s ease-out',
              pointerEvents: 'none',
            }}
          >
            {!isCopied ? (
              <>
                <Icon
                  icon={IconType.Link2}
                  size={64}
                  color="secondaryText"
                  sx={{ zIndex: 2, cursor: 'pointer', pointerEvents: 'auto', ':hover': { color: 'primaryText' } }}
                  mr={'64px'}
                  onClick={() => {
                    copy(tradeShareUrl)
                    setIsCopied(true)
                    setTimeout(() => {
                      setIsCopied(false)
                    }, 600)
                  }}
                />
                <Icon
                  color="secondaryText"
                  icon={IconType.Twitter}
                  size={64}
                  sx={{ zIndex: 2, cursor: 'pointer', pointerEvents: 'auto', ':hover': { color: '#1DA1F2' } }}
                  onClick={() => {
                    window.open(`${TWITTER_URL}/share?url=${tradeShareUrl}`, '_blank')
                  }}
                />
              </>
            ) : (
              <Center flexDirection="column">
                <Text mb={4} variant="heading" color="secondaryText">
                  Copied
                </Text>
                <Icon size={64} icon={IconType.Check} color="secondaryText" />
              </Center>
            )}
          </CenterFadeIn>
        ) : null}
        <PositionShareSVG position={position} height={SHARE_CARD_SIZE} width={SHARE_CARD_SIZE} />
      </CardBody>
    </Card>
  )
}

export default PositionShareCard
