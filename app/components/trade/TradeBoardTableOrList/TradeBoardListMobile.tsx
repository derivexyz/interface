import Box from '@lyra/ui/components/Box'
import CardSection from '@lyra/ui/components/Card/CardSection'
import CardSeparator from '@lyra/ui/components/Card/CardSeparator'
import Flex from '@lyra/ui/components/Flex'
import { ListElement } from '@lyra/ui/components/List'
import Modal from '@lyra/ui/components/Modal'
import Text from '@lyra/ui/components/Text'
import formatDate from '@lyra/ui/utils/formatDate'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import formatUSD from '@lyra/ui/utils/formatUSD'
import { Option, Quote } from '@lyrafinance/lyra-js'
import React, { useState } from 'react'

import { MAX_IV } from '@/app/constants/contracts'
import fromBigNumber from '@/app/utils/fromBigNumber'

import OptionStatsGrid from '../../common/OptionStatsGrid'
import { TradeBoardTableOrListProps } from '.'
import TradeBoardPriceButton from './TradeBoardPriceButton'

const TradeBoardListMobile = ({
  isCall,
  isBuy,
  quotes,
  selectedOption,
  onSelectOption,
  ...styleProps
}: TradeBoardTableOrListProps): ListElement => {
  const [expandedQuote, setExpandedQuote] = useState<{ bid: Quote; ask: Quote; option: Option } | null>(null)
  const strikeId = selectedOption?.strike().id
  return (
    <Box {...styleProps}>
      {quotes.map(({ option, bid, ask }) => {
        const quote = isBuy ? bid : ask
        return (
          <React.Fragment key={option.strike().id}>
            <CardSection
              onClick={() => {
                setExpandedQuote({ option, bid, ask })
              }}
            >
              <Text variant="bodyMedium" color="text" mb={4}>
                {formatUSD(option.strike().strikePrice)} {option.isCall ? 'Call' : 'Put'}
              </Text>
              <Flex alignItems="center">
                <Box>
                  <Text variant="secondary" color="secondaryText" mb={2}>
                    Break Even
                  </Text>
                  <Text variant="secondary" color="text">
                    {formatUSD(quote.breakEven)}
                  </Text>
                </Box>
                <Box ml={6}>
                  <Text variant="secondary" color="secondaryText" mb={2}>
                    Implied Vol
                  </Text>
                  <Text variant="secondary" color="text">
                    {quote.iv.gt(0) && quote.iv.lt(MAX_IV) ? formatPercentage(fromBigNumber(quote.iv), true) : '-'}
                  </Text>
                </Box>
                <TradeBoardPriceButton
                  ml="auto"
                  quote={quote}
                  isSelected={strikeId === quote.strike().id}
                  onSelected={() => onSelectOption(quote.option())}
                />
              </Flex>
            </CardSection>
            <CardSeparator />
          </React.Fragment>
        )
      })}
      <Modal
        isOpen={!!expandedQuote}
        onClose={() => setExpandedQuote(null)}
        title={
          expandedQuote ? (
            <Text variant="heading" ml={6} mt={6}>
              {expandedQuote.option.market().name} ${fromBigNumber(expandedQuote.option.strike().strikePrice)}{' '}
              {isCall ? 'Call' : 'Put'}
              <Text as="span" color="secondaryText">
                &nbsp;·&nbsp;Exp. {formatDate(expandedQuote.option.board().expiryTimestamp, true)}
              </Text>
            </Text>
          ) : (
            ''
          )
        }
      >
        {expandedQuote ? (
          <CardSection>
            <OptionStatsGrid option={expandedQuote.option} isBuy={isBuy} />
          </CardSection>
        ) : null}
      </Modal>
    </Box>
  )
}

export default TradeBoardListMobile
