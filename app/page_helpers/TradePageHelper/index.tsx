import Button from '@lyra/ui/components/Button'
import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Center from '@lyra/ui/components/Center'
import Flex from '@lyra/ui/components/Flex'
import Icon, { IconType } from '@lyra/ui/components/Icon'
import Text from '@lyra/ui/components/Text'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import formatUSD from '@lyra/ui/utils/formatUSD'
import { Market, Option } from '@lyrafinance/lyra-js'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import { DESKTOP_HEADER_NAV_HEIGHT, DESKTOP_RIGHT_COLUMN_WIDTH, MIN_TRADE_CARD_HEIGHT } from '@/app/constants/layout'
import { LogEvent } from '@/app/constants/logEvents'
import { PageId } from '@/app/constants/pages'
import TradeAdvancedBoardCard from '@/app/containers/trade/TradeAdvancedBoardCard'
import TradeForm from '@/app/containers/trade/TradeForm'
import TradeFormModal from '@/app/containers/trade/TradeFormModal'
import TradeMarketDropdown from '@/app/containers/trade/TradeMarketDropdown'
import TradeOpenPositionsFloatingButton from '@/app/containers/trade/TradeOpenPositionsFloatingButton'
import TradePositionsCard from '@/app/containers/trade/TradePositionsCard'
import TradePriceCard from '@/app/containers/trade/TradePriceCard'
import TradeSimpleBoardCard from '@/app/containers/trade/TradeSimpleBoardCard'
import useTraderSettings from '@/app/hooks/local_storage/useTraderSettings'
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
  const { push } = useRouter()
  const isMobile = useIsMobile()
  const [selectedOption, setSelectedOption] = useState<Option | null>(null)
  const [selectedBoard, setSelectedBoard] = useSelectedBoard(market) // sync hook
  const [isCall, setIsCall] = useState(true)
  const [isBuy, setIsBuy] = useState(true)
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false)
  const [traderSettings, setTraderSettings] = useTraderSettings()
  const [isPositionCardInView, setIsPositionCardInView] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const positionCardRef = useRef<HTMLElement>()
  const selectedStrikeId = selectedOption?.strike().id ?? null
  const isAdvancedMode = traderSettings.isAdvancedMode

  const scrollHandler = useCallback(() => {
    if (positionCardRef.current) {
      const rect = positionCardRef.current.getBoundingClientRect()
      if (rect.top + rect.height / 3 <= window.innerHeight) {
        setIsPositionCardInView(true)
        if (window.scrollY >= window.innerHeight) {
          setShowBackToTop(true)
        }
      } else {
        setIsPositionCardInView(false)
        setShowBackToTop(false)
      }
    }
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', scrollHandler)
    return () => {
      window.removeEventListener('scroll', scrollHandler)
    }
  }, [scrollHandler])

  const handleClickFloatingActionButton = useCallback(() => {
    if (!isPositionCardInView) {
      window.scrollBy({ top: document.body.scrollHeight })
    } else {
      window.scrollTo({ top: 0 })
    }
  }, [isPositionCardInView])

  const handleTrade = useCallback(
    (market: Market, positionId: number) => {
      if (isAdvancedMode) {
        window.scrollBy({ top: document.body.scrollHeight })
        return
      }
      push(getPagePath({ page: PageId.Position, marketAddressOrName: market.name, positionId })).then(() => {
        setSelectedOption(null)
      })
    },
    [push, setSelectedOption, isAdvancedMode]
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

  const handleSelectOption = useCallback(
    (newOption: Option) => {
      const isSelect = selectedStrikeId !== newOption.strike().id
      if (isSelect) {
        setSelectedOption(newOption)
        setIsTradeModalOpen(true)
      } else {
        setIsTradeModalOpen(false)
        setSelectedOption(null)
      }
      logEvent(isSelect ? LogEvent.BoardOptionSelect : LogEvent.BoardOptionDeselect, {
        marketName: market.name,
        marketAddress: market.address,
        isCall,
        strikeId: newOption.strike().id,
        strikePrice: newOption.strike().strikePrice,
        boardId: newOption.board().id,
        expiryTimestamp: newOption.board().expiryTimestamp,
      })
    },
    [market, isCall, selectedStrikeId]
  )

  const handleSelectChainOption = useCallback(
    (newOption: Option, newIsBuy: boolean, newIsCall: boolean) => {
      const isSelect = selectedStrikeId !== newOption.strike().id || newIsBuy !== isBuy || newIsCall !== isCall
      setIsBuy(newIsBuy)
      setIsCall(newIsCall)
      if (isSelect) {
        setSelectedOption(newOption)
        setIsTradeModalOpen(true)
      } else {
        setIsTradeModalOpen(false)
        setSelectedOption(null)
      }
      logEvent(isSelect ? LogEvent.BoardOptionSelect : LogEvent.BoardOptionDeselect, {
        marketName: market.name,
        marketAddress: market.address,
        isCall,
        strikeId: newOption.strike().id,
        strikePrice: newOption.strike().strikePrice,
        boardId: newOption.board().id,
        expiryTimestamp: newOption.board().expiryTimestamp,
      })
    },
    [market, isCall, isBuy, selectedStrikeId]
  )

  const handleToggleBuy = useCallback((newIsBuy: boolean) => {
    setIsBuy(newIsBuy)
  }, [])

  const handleChangeAdvancedMode = useCallback(
    (newIsAdvancedMode: boolean) => {
      setTraderSettings('isAdvancedMode', {
        isAdvancedMode: newIsAdvancedMode,
        isCandleChart: newIsAdvancedMode,
      })
      logEvent(LogEvent.TradeToggleAdvancedMode, { advancedMode: newIsAdvancedMode })
    },
    [setTraderSettings]
  )

  return (
    <Layout
      mobileCollapsedHeader={`${getMarketDisplayName(market.baseToken.symbol)} ${formatUSD(market.spotPrice)}`}
      desktopRightColumn={
        <Card
          minHeight={MIN_TRADE_CARD_HEIGHT}
          overflowY="auto"
          sx={{ position: 'sticky', top: DESKTOP_HEADER_NAV_HEIGHT }}
        >
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
      header={
        <Flex alignItems="flex-end">
          <TradeMarketDropdown onChangeMarket={handleChangeMarket} selectedMarket={market} />
          {!isMobile ? (
            <Flex ml="auto" mr={DESKTOP_RIGHT_COLUMN_WIDTH} mb={2} alignItems="center">
              <Button
                isTransparent={isAdvancedMode}
                label="Simple"
                variant={isAdvancedMode ? 'light' : 'default'}
                onClick={() => handleChangeAdvancedMode(false)}
              />
              <Button
                ml={2}
                isTransparent={!isAdvancedMode}
                label="Advanced"
                variant={isAdvancedMode ? 'default' : 'light'}
                onClick={() => handleChangeAdvancedMode(true)}
              />
            </Flex>
          ) : null}
        </Flex>
      }
    >
      <LayoutGrid key="layout-grid" sx={{ position: 'relative' }}>
        <TradePriceCard marketAddressOrName={market.address} />
        {!isAdvancedMode || isMobile ? (
          <TradeSimpleBoardCard
            isCall={isCall}
            onToggleCall={newIsCall => {
              if (newIsCall !== isCall) {
                // Reset selected option
                setSelectedOption(null)
              }
              setIsCall(newIsCall)
            }}
            isBuy={isBuy}
            onToggleBuy={handleToggleBuy}
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
            onSelectOption={handleSelectOption}
          />
        ) : (
          <TradeAdvancedBoardCard
            market={market}
            selectedOption={selectedOption}
            onSelectOption={handleSelectChainOption}
            isBuy={isBuy}
          />
        )}
        <TradePositionsCard ref={positionCardRef} />
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
        {!isPositionCardInView || (!isMobile && showBackToTop) ? (
          <TradeOpenPositionsFloatingButton
            label={isPositionCardInView ? 'Back to Top' : 'Open Positions'}
            rightIcon={isPositionCardInView ? IconType.ArrowUp : IconType.ArrowDown}
            mr={isMobile ? 0 : DESKTOP_RIGHT_COLUMN_WIDTH + 24}
            onClick={handleClickFloatingActionButton}
          />
        ) : null}
      </LayoutGrid>
    </Layout>
  )
}
