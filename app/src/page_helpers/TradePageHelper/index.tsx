import Button from '@lyra/ui/components/Button'
import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Center from '@lyra/ui/components/Center'
import Flex from '@lyra/ui/components/Flex'
import Icon, { IconType } from '@lyra/ui/components/Icon'
import Text from '@lyra/ui/components/Text'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import formatUSD from '@lyra/ui/utils/formatUSD'
import { Market, Option, Position } from '@lyrafinance/lyra-js'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  DESKTOP_HEADER_NAV_HEIGHT,
  DESKTOP_LAYOUT_RIGHT_COLUMN_MIN_WIDTH,
  MIN_TRADE_CARD_HEIGHT,
} from '@/app/constants/layout'
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
import useQueryBoardIdSync from '@/app/hooks/market/useQueryBoardIdSync'
import useSelectedStrikeIdSync from '@/app/hooks/market/useQueryStrikeIdSync'
import useBoolQueryParam from '@/app/hooks/url/useBoolQueryParam'
import getMarketDisplayName from '@/app/utils/getMarketDisplayName'
import getPagePath from '@/app/utils/getPagePath'
import logEvent from '@/app/utils/logEvent'

import Page from '../common/Page'
import PageGrid from '../common/Page/PageGrid'

type Props = {
  markets: Market[]
  selectedMarket: Market
  openPositions: Position[]
}

export default function TradePageHelper({ markets, selectedMarket, openPositions }: Props): JSX.Element {
  const isMobile = useIsMobile()

  const [queryBoardId, setSelectedBoardId] = useQueryBoardIdSync(selectedMarket)

  const selectedBoard = useMemo(() => {
    return selectedMarket.liveBoards().find(b => b.id === queryBoardId) ?? null
  }, [queryBoardId, selectedMarket])

  const [selectedStrikeId, setSelectedStrikeId] = useSelectedStrikeIdSync(selectedBoard)

  const [isCall, setIsCall] = useBoolQueryParam('call', { isNullTrue: true })
  const [isBuy, setIsBuy] = useBoolQueryParam('buy', { isNullTrue: true })

  const selectedOption = useMemo(() => {
    return selectedStrikeId ? selectedMarket.liveOption(selectedStrikeId, isCall) : null
  }, [selectedMarket, isCall, selectedStrikeId])

  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false)
  const [traderSettings, setTraderSettings] = useTraderSettings()
  const positionCardRef = useRef<HTMLElement>()
  const positionButtonRef = useRef<HTMLElement>()

  const isAdvancedMode = traderSettings.isAdvancedMode

  const navigate = useNavigate()

  const refreshPositionButton = useCallback(() => {
    if (positionCardRef.current && positionButtonRef.current) {
      const rect = positionCardRef.current.getBoundingClientRect()
      if (rect.top <= window.innerHeight) {
        positionButtonRef.current.style.display = 'none'
      } else {
        positionButtonRef.current.style.display = 'block'
      }
    }
  }, [])

  useEffect(() => {
    refreshPositionButton()
  }, [refreshPositionButton])

  useEffect(() => {
    const handleRefreshPositionButton = () => requestAnimationFrame(refreshPositionButton)
    document.addEventListener('scroll', handleRefreshPositionButton)
    const resizeObserver = new ResizeObserver(handleRefreshPositionButton)
    resizeObserver.observe(document.body)
    return () => {
      document.removeEventListener('resize', handleRefreshPositionButton)
      resizeObserver.unobserve(document.body)
    }
  }, [refreshPositionButton])

  const handleClickFloatingActionButton = useCallback(() => {
    window.scrollBy({ top: document.body.scrollHeight })
  }, [])

  const handleTrade = useCallback(
    (market: Market, positionId: number) => {
      setSelectedStrikeId(null)
      if (isAdvancedMode) {
        window.scrollBy({ top: document.body.scrollHeight })
      } else {
        navigate(
          getPagePath({
            page: PageId.Position,
            network: market.lyra.network,
            marketAddressOrName: market.name,
            positionId,
          })
        )
      }
    },
    [navigate, setSelectedStrikeId, isAdvancedMode]
  )

  const handleChangeMarket = useCallback(
    (newMarket: Market) => {
      if (newMarket.address !== selectedMarket.address) {
        // Reset selected board + option when market changes
        setSelectedBoardId(null)
        setSelectedStrikeId(null)
        navigate(
          getPagePath({
            page: PageId.Trade,
            network: newMarket.lyra.network,
            marketAddressOrName: newMarket.name,
          })
        )
      }
    },
    [navigate, selectedMarket.address, setSelectedBoardId, setSelectedStrikeId]
  )

  const handleSelectOption = useCallback(
    (newOption: Option) => {
      const isSelect = selectedStrikeId !== newOption.strike().id
      if (isSelect) {
        setSelectedStrikeId(newOption.strike().id)
        setIsTradeModalOpen(true)
      } else {
        setIsTradeModalOpen(false)
        setSelectedStrikeId(null)
      }
      logEvent(isSelect ? LogEvent.BoardOptionSelect : LogEvent.BoardOptionDeselect, {
        marketName: selectedMarket.name,
        marketAddress: selectedMarket.address,
        isCall,
        strikeId: newOption.strike().id,
        strikePrice: newOption.strike().strikePrice,
        boardId: newOption.board().id,
        expiryTimestamp: newOption.board().expiryTimestamp,
      })
    },
    [selectedStrikeId, selectedMarket.name, selectedMarket.address, isCall, setSelectedStrikeId]
  )

  const handleSelectChainOption = useCallback(
    (newOption: Option, newIsBuy: boolean, newIsCall: boolean) => {
      const isSelect = selectedStrikeId !== newOption.strike().id || newIsBuy !== isBuy || newIsCall !== isCall
      setIsBuy(newIsBuy)
      setIsCall(newIsCall)
      if (isSelect) {
        setSelectedStrikeId(newOption.strike().id)
        setIsTradeModalOpen(true)
      } else {
        setIsTradeModalOpen(false)
        setSelectedStrikeId(null)
      }
      logEvent(isSelect ? LogEvent.BoardOptionSelect : LogEvent.BoardOptionDeselect, {
        marketName: selectedMarket.name,
        marketAddress: selectedMarket.address,
        isCall,
        strikeId: newOption.strike().id,
        strikePrice: newOption.strike().strikePrice,
        boardId: newOption.board().id,
        expiryTimestamp: newOption.board().expiryTimestamp,
      })
    },
    [
      selectedStrikeId,
      isBuy,
      isCall,
      setIsBuy,
      setIsCall,
      selectedMarket.name,
      selectedMarket.address,
      setSelectedStrikeId,
    ]
  )

  const handleToggleBuy = useCallback(
    (newIsBuy: boolean) => {
      setIsBuy(newIsBuy)
    },
    [setIsBuy]
  )

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

  const selectedPosition = useMemo(() => {
    if (selectedOption) {
      return openPositions.find(
        p =>
          p.marketAddress === selectedMarket.address &&
          p.strikeId === selectedStrikeId &&
          p.isCall === selectedOption.isCall
      )
    }
  }, [openPositions, selectedMarket.address, selectedOption, selectedStrikeId])

  return (
    <Page
      mobileCollapsedHeader={
        <Text as="span">
          {getMarketDisplayName(selectedMarket)}
          <Text as="span" color="secondaryText">
            &nbsp;·&nbsp;
            {formatUSD(selectedMarket.spotPrice)}
          </Text>
        </Text>
      }
      desktopRightColumn={
        <Card
          width={DESKTOP_LAYOUT_RIGHT_COLUMN_MIN_WIDTH}
          minHeight={MIN_TRADE_CARD_HEIGHT}
          sx={{ position: 'sticky', top: DESKTOP_HEADER_NAV_HEIGHT }}
        >
          {selectedOption ? (
            <TradeForm isBuy={isBuy} option={selectedOption} onTrade={handleTrade} position={selectedPosition} />
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
          <TradeMarketDropdown markets={markets} onChangeMarket={handleChangeMarket} selectedMarket={selectedMarket} />
          {!isMobile ? (
            <Flex mr={DESKTOP_LAYOUT_RIGHT_COLUMN_MIN_WIDTH} ml="auto" mb={2} alignItems="center">
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
      <PageGrid key="layout-grid" sx={{ position: 'relative' }}>
        <TradePriceCard market={selectedMarket} />
        {!isAdvancedMode || isMobile ? (
          <TradeSimpleBoardCard
            isCall={isCall}
            onToggleCall={newIsCall => {
              if (newIsCall !== isCall) {
                // Reset selected option
                setSelectedStrikeId(null)
              }
              setIsCall(newIsCall)
            }}
            isBuy={isBuy}
            onToggleBuy={handleToggleBuy}
            market={selectedMarket}
            selectedBoard={selectedBoard}
            onSelectBoard={newBoard => {
              if (newBoard.id !== selectedBoard?.id) {
                // Reset selected option
                setSelectedStrikeId(null)
              }
              setSelectedBoardId(newBoard?.id ?? null)
            }}
            selectedOption={selectedOption}
            onSelectOption={handleSelectOption}
          />
        ) : (
          <TradeAdvancedBoardCard
            market={selectedMarket}
            selectedOption={selectedOption}
            onSelectOption={handleSelectChainOption}
            isBuy={isBuy}
          />
        )}
        <TradePositionsCard market={selectedMarket} openPositions={openPositions} ref={positionCardRef} />
        {selectedOption && isMobile ? (
          <TradeFormModal
            option={selectedOption}
            position={selectedPosition}
            isBuy={isBuy}
            onTrade={handleTrade}
            isOpen={isTradeModalOpen}
            onClose={() => {
              setIsTradeModalOpen(false)
              setSelectedStrikeId(null)
            }}
          />
        ) : null}
        {openPositions.length ? (
          <TradeOpenPositionsFloatingButton
            ref={positionButtonRef}
            label="Open Positions"
            rightIcon={IconType.ArrowDown}
            mr={isMobile ? 0 : DESKTOP_LAYOUT_RIGHT_COLUMN_MIN_WIDTH + 24}
            onClick={handleClickFloatingActionButton}
          />
        ) : null}
      </PageGrid>
    </Page>
  )
}
