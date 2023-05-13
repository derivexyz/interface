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

import formatTokenName from '@/app/utils/formatTokenName'
import fromBigNumber from '@/app/utils/fromBigNumber'

import LabelItem from '../../common/LabelItem'
import OptionStatsGrid from '../../common/OptionStatsGrid'
import { TradeBoardTableOrListProps } from '.'
import TradeBoardPriceButton from './TradeBoardPriceButton'

const TradeBoardListMobile = ({
  isBuy,
  quotes,
  selectedOption,
  onSelectOption,
}: TradeBoardTableOrListProps): ListElement => {
  const [expandedQuote, setExpandedQuote] = useState<{ bid: Quote | null; ask: Quote | null; option: Option } | null>(
    null
  )
  const strikeId = selectedOption?.strike().id
  const spotPriceRowIdx = quotes.reduce(
    (markerIdx, { option }) => (option.market().spotPrice.lt(option.strike().strikePrice) ? markerIdx : markerIdx + 1),
    0
  )
  return (
    <Box>
      {quotes.map(({ option, bid, ask }, idx) => {
        const quote = isBuy ? ask : bid
        const strike = option.strike()
        const market = option.market()

        if (!quote) {
          return null
        }

        return (
          <React.Fragment key={strike.id}>
            {idx === spotPriceRowIdx ? (
              <>
                <CardSection>
                  <Text>
                    {formatTokenName(market.baseToken)} Price:{' '}
                    <Text as="span" color="primaryText">
                      {formatUSD(market.spotPrice)}
                    </Text>
                  </Text>
                </CardSection>
                <CardSeparator />
              </>
            ) : null}
            <CardSection
              onClick={() => {
                setExpandedQuote({ option, bid, ask })
              }}
            >
              <Text variant="bodyMedium" color="text" mb={4}>
                {formatUSD(option.strike().strikePrice)} {option.isCall ? 'Call' : 'Put'}
              </Text>
              <Flex alignItems="center">
                <LabelItem label="Break Even" value={formatUSD(quote.breakEven)} />
                <LabelItem ml={6} label="Implied Vol" value={formatPercentage(fromBigNumber(quote.iv), true)} />
                <TradeBoardPriceButton
                  ml="auto"
                  quote={quote}
                  isSelected={strikeId === quote.strike().id}
                  onSelected={() => onSelectOption(quote.option())}
                />
              </Flex>
            </CardSection>
            {idx < quotes.length - 1 ? <CardSeparator /> : null}
          </React.Fragment>
        )
      })}
      <Modal
        isOpen={!!expandedQuote}
        onClose={() => setExpandedQuote(null)}
        title={
          expandedQuote ? (
            <Text variant="cardHeading">
              {expandedQuote.option.market().name} ${fromBigNumber(expandedQuote.option.strike().strikePrice)}{' '}
              {expandedQuote.option.isCall ? 'Call' : 'Put'}
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
            <OptionStatsGrid {...expandedQuote} />
          </CardSection>
        ) : null}
      </Modal>
    </Box>
  )
}

export default TradeBoardListMobile
