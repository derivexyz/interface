import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Center from '@lyra/ui/components/Center'
import Icon, { IconType } from '@lyra/ui/components/Icon'
import Text from '@lyra/ui/components/Text'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import formatUSD from '@lyra/ui/utils/formatUSD'
import { Market, Option } from '@lyrafinance/lyra-js'
import { useRouter } from 'next/router'
import React, { useCallback, useState } from 'react'

import { MIN_TRADE_CARD_HEIGHT } from '@/app/constants/layout'
import { LogEvent } from '@/app/constants/logEvents'
import { PageId } from '@/app/constants/pages'
import TradeBoardCard from '@/app/containers/trade/TradeBoardCard'
import TradeForm from '@/app/containers/trade/TradeForm'
import TradeFormModal from '@/app/containers/trade/TradeFormModal'
import TradeMarketDropdown from '@/app/containers/trade/TradeMarketDropdown'
import TradePositionsDrawer from '@/app/containers/trade/TradePositionsDrawer'
import TradePriceCard from '@/app/containers/trade/TradePriceCard'
import useSelectedBoard from '@/app/hooks/market/useSelectedBoard'
import getMarketDisplayName from '@/app/utils/getMarketDisplayName'
import getPagePath from '@/app/utils/getPagePath'
import logEvent from '@/app/utils/logEvent'

import Layout from '../common/Layout'
import LayoutGrid from '../common/Layout/LayoutGrid'

type Props = {
  market: Market
}

export default function TradePageHelper({ market: initialMarket }: Props): JSX.Element {
  const [market, setMarket] = useState(initialMarket)

  const [isPositionDrawerOpen, setIsPositionDrawerOpen] = useState(false)
  const { push } = useRouter()
  const [selectedOption, setSelectedOption] = useState<Option | null>(null)
  const [selectedBoard, setSelectedBoard] = useSelectedBoard(market) // sync hook
  const [isCall, setIsCall] = useState(true)
  const [isBuy, setIsBuy] = useState(true)
  const selectedStrikeId = selectedOption?.strike().id ?? null
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false)

  const handleTrade = useCallback(
    (market: Market, positionId: number) => {
      push(getPagePath({ page: PageId.Position, marketAddressOrName: market.name, positionId })).then(() => {
        setSelectedOption(null)
      })
    },
    [push, setSelectedOption]
  )

  const handleChangeMarket = useCallback(
    (newMarket: Market) => {
      if (newMarket.address !== market.address) {
        // Reset selected board + option when market changes
        setSelectedBoard(null)
        setSelectedOption(null)
        setMarket(newMarket)
        push(getPagePath({ page: PageId.Trade, marketAddressOrName: newMarket.name }), undefined, { shallow: true })
      }
    },
    [market.address, push, setSelectedBoard]
  )

  const isMobile = useIsMobile()

  return (
    <Layout
      mobileCollapsedHeader={`${getMarketDisplayName(market.baseToken.symbol)} ${formatUSD(market.spotPrice)}`}
      desktopRightColumn={
        <Card minHeight={MIN_TRADE_CARD_HEIGHT} overflowY="auto">
          {selectedOption ? (
            <TradeForm isBuy={isBuy} option={selectedOption} onTrade={handleTrade} />
          ) : (
            <CardBody flexGrow={1}>
              <Text variant="heading">Select Option</Text>
              <Center flexGrow={1} flexDirection="column">
                <Icon icon={IconType.PlusCircle} color="disabledText" size={64} strokeWidth={0.5} />
                <Text mt={4} variant="secondary" color="secondaryText">
                  Select an option
                </Text>
              </Center>
            </CardBody>
          )}
        </Card>
      }
      header={<TradeMarketDropdown onChangeMarket={handleChangeMarket} selectedMarket={market} />}
      desktopFooter={
        <TradePositionsDrawer
          marketAddressOrName={market.address}
          isExpanded={isPositionDrawerOpen}
          onToggleExpanded={setIsPositionDrawerOpen}
        />
      }
    >
      <LayoutGrid>
        <TradePriceCard marketAddressOrName={market.address} />
        <TradeBoardCard
          isCall={isCall}
          onToggleCall={newIsCall => {
            if (newIsCall !== isCall) {
              // Reset selected option
              setSelectedOption(null)
            }
            setIsCall(newIsCall)
          }}
          isBuy={isBuy}
          onToggleBuy={newIsBuy => {
            setIsBuy(newIsBuy)
          }}
          market={market}
          selectedBoard={selectedBoard}
          onSelectBoard={newBoard => {
            if (newBoard.id !== selectedBoard?.id) {
              // Reset selected option
              setSelectedOption(null)
            }
            setSelectedBoard(newBoard)
          }}
          selectedOption={selectedOption}
          onSelectOption={newOption => {
            const isSelect = selectedStrikeId !== newOption.strike().id
            if (isSelect) {
              setSelectedOption(newOption)
              setIsTradeModalOpen(true)
            } else {
              setIsTradeModalOpen(false)
              setSelectedOption(null)
            }
            logEvent(isSelect ? LogEvent.BoardOptionSelect : LogEvent.BoardOptionDeslect, {
              marketName: market.name,
              marketAddress: market.address,
              isCall,
              strikeId: newOption.strike().id,
              strikePrice: newOption.strike().strikePrice,
              boardId: newOption.board().id,
              expiryTimestamp: newOption.board().expiryTimestamp,
            })
          }}
        />
        {selectedOption && isMobile ? (
          <TradeFormModal
            option={selectedOption}
            isBuy={isBuy}
            onTrade={handleTrade}
            isOpen={isTradeModalOpen}
            onClose={() => {
              setIsTradeModalOpen(false)
              setSelectedOption(null)
            }}
          />
        ) : null}
      </LayoutGrid>
    </Layout>
  )
}
