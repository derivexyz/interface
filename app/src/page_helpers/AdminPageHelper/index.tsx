import Button from '@lyra/ui/components/Button'
import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Flex from '@lyra/ui/components/Flex'
import Text from '@lyra/ui/components/Text'
import { AdminMarketGlobalCache, Market } from '@lyrafinance/lyra-js'
import React, { useState } from 'react'
import { useCallback } from 'react'

import AdminAddMarket from '@/app/containers/admin/AdminAddMarket'
import AdminGlobalInfo from '@/app/containers/admin/AdminGlobalInfo'
import AdminMarketAdapterPricingParams from '@/app/containers/admin/AdminMarketAdapterPricingParams'
import AdminMarketAddBoard from '@/app/containers/admin/AdminMarketAddBoard'
import AdminMarketBoardsInfo from '@/app/containers/admin/AdminMarketBoardsInfo'
import AdminMarketCircuitBreakerParams from '@/app/containers/admin/AdminMarketCircuitBreakerParams'
import AdminMarketForceCloseParams from '@/app/containers/admin/AdminMarketForceCloseParams'
import AdminMarketFuturesPoolHedgerParams from '@/app/containers/admin/AdminMarketFuturesPoolHedgerParams'
import AdminMarketGreekCacheParams from '@/app/containers/admin/AdminMarketGreekCacheParams'
import AdminMarketGuardianProcess from '@/app/containers/admin/AdminMarketGuardianProcess'
import AdminMarketLpParams from '@/app/containers/admin/AdminMarketLpParams'
import AdminMarketMinCollateralParams from '@/app/containers/admin/AdminMarketMinCollateralParams'
import AdminMarketOptionMarketParams from '@/app/containers/admin/AdminMarketOptionMarketParams'
import AdminMarketPartialCollatParams from '@/app/containers/admin/AdminMarketPartialCollatParams'
import AdminMarketPauseButton from '@/app/containers/admin/AdminMarketPauseButton'
import AdminMarketPoolHedgerParams from '@/app/containers/admin/AdminMarketPoolHedgerParams'
import AdminMarketPricingParams from '@/app/containers/admin/AdminMarketPricingParams'
import AdminMarketSelect from '@/app/containers/admin/AdminMarketSelect'
import AdminMarketTradeLimitParams from '@/app/containers/admin/AdminMarketTradeLimitParams'
import AdminMarketVarianceFeeParams from '@/app/containers/admin/AdminMarketVarianceFeeParams'
import AdminTransactionCard from '@/app/containers/admin/AdminTransactionCard'

import Page from '../common/Page'
import PageGrid from '../common/Page/PageGrid'

type Props = {
  markets: Market[]
  selectedMarket: Market
  selectedGlobalCache: AdminMarketGlobalCache
}

const AdminPageHelper = ({ markets, selectedMarket, selectedGlobalCache }: Props) => {
  const [isGreekCacheExpanded, setIsGreekCacheExpanded] = useState(false)
  const [isForceCloseExpanded, setIsForceCloseExpanded] = useState(false)
  const [isMinCollateralExpanded, setIsMinCollateralExpanded] = useState(false)
  const [isOptionMarketExpanded, setIsOptionMarketExpanded] = useState(false)
  const [isLPExpanded, setIsLPExpanded] = useState(false)
  const [isPartialCollatExpanded, setIsPartialCollatExpanded] = useState(false)
  const [isPricingExpanded, setIsPricingExpanded] = useState(false)
  const [isVarianceFeesExpanded, setIsVarianceFeesExpanded] = useState(false)
  const [isTradeLimitExpanded, setIsTradeLimitExpanded] = useState(false)
  const [isPoolHedgerExpanded, setIsPoolHedgerExpanded] = useState(false)
  const [isFuturesPoolHedgerExpanded, setIsFuturesPoolHedgerExpanded] = useState(false)
  const [isAdapterMarketPricingParamsExpanded, setIsAdapterMarketPricingParamsExpanded] = useState(false)
  const [isCircuitBreakerParamsExpanded, setIsCircuitBreakerParamsExpanded] = useState(false)
  const [isGuardianProcessExpanded, setIsGuardianProcessExpanded] = useState(false)

  const selectedGlobalOwner = selectedMarket.params.owner

  const setAllExpanded = useCallback((isExpanded: boolean) => {
    setIsGreekCacheExpanded(isExpanded)
    setIsForceCloseExpanded(isExpanded)
    setIsMinCollateralExpanded(isExpanded)
    setIsOptionMarketExpanded(isExpanded)
    setIsLPExpanded(isExpanded)
    setIsPartialCollatExpanded(isExpanded)
    setIsPricingExpanded(isExpanded)
    setIsVarianceFeesExpanded(isExpanded)
    setIsTradeLimitExpanded(isExpanded)
    setIsGuardianProcessExpanded(isExpanded)
    setIsPoolHedgerExpanded(isExpanded)
    setIsFuturesPoolHedgerExpanded(isExpanded)
    setIsAdapterMarketPricingParamsExpanded(isExpanded)
    setIsCircuitBreakerParamsExpanded(isExpanded)
  }, [])

  return (
    <Page
      header={<AdminMarketSelect markets={markets} selectedMarket={selectedMarket} />}
      desktopRightColumn={
        <AdminTransactionCard network={selectedMarket.lyra.network} globalOwner={selectedGlobalOwner} />
      }
    >
      <PageGrid>
        <AdminGlobalInfo isGlobalPaused={selectedMarket.params.isGlobalPaused} globalOwner={selectedGlobalOwner} />
        <AdminMarketPauseButton market={selectedMarket} />
        <AdminMarketBoardsInfo market={selectedMarket} />
        <AdminMarketAddBoard market={selectedMarket} />
        <Card>
          <CardBody noPadding>
            <Flex my={6} mx={6} mb={4}>
              <Text variant="heading">Market Parameters</Text>
              <Flex ml="auto">
                <Button label="Expand All" onClick={() => setAllExpanded(true)} />
                <Button ml={2} label="Collapse All" onClick={() => setAllExpanded(false)} />
              </Flex>
            </Flex>
            <AdminMarketGreekCacheParams
              market={selectedMarket}
              isExpanded={isGreekCacheExpanded}
              onClickExpand={() => setIsGreekCacheExpanded(!isGreekCacheExpanded)}
            />
            <AdminMarketForceCloseParams
              market={selectedMarket}
              isExpanded={isForceCloseExpanded}
              onClickExpand={() => setIsForceCloseExpanded(!isForceCloseExpanded)}
            />
            <AdminMarketMinCollateralParams
              market={selectedMarket}
              isExpanded={isMinCollateralExpanded}
              onClickExpand={() => setIsMinCollateralExpanded(!isMinCollateralExpanded)}
            />
            <AdminMarketOptionMarketParams
              market={selectedMarket}
              isExpanded={isOptionMarketExpanded}
              onClickExpand={() => setIsOptionMarketExpanded(!isOptionMarketExpanded)}
            />
            <AdminMarketLpParams
              market={selectedMarket}
              isExpanded={isLPExpanded}
              onClickExpand={() => setIsLPExpanded(!isLPExpanded)}
            />
            <AdminMarketPartialCollatParams
              market={selectedMarket}
              isExpanded={isPartialCollatExpanded}
              onClickExpand={() => setIsPartialCollatExpanded(!isPartialCollatExpanded)}
            />
            <AdminMarketPricingParams
              market={selectedMarket}
              isExpanded={isPricingExpanded}
              onClickExpand={() => setIsPricingExpanded(!isPricingExpanded)}
            />
            <AdminMarketVarianceFeeParams
              market={selectedMarket}
              isExpanded={isVarianceFeesExpanded}
              onClickExpand={() => setIsVarianceFeesExpanded(!isVarianceFeesExpanded)}
            />
            <AdminMarketTradeLimitParams
              market={selectedMarket}
              isExpanded={isTradeLimitExpanded}
              onClickExpand={() => setIsTradeLimitExpanded(!isTradeLimitExpanded)}
            />
            <AdminMarketPoolHedgerParams
              market={selectedMarket}
              isExpanded={isPoolHedgerExpanded}
              onClickExpand={() => setIsPoolHedgerExpanded(!isPoolHedgerExpanded)}
            />
            <AdminMarketFuturesPoolHedgerParams
              market={selectedMarket}
              isExpanded={isFuturesPoolHedgerExpanded}
              onClickExpand={() => setIsFuturesPoolHedgerExpanded(!isFuturesPoolHedgerExpanded)}
            />
            <AdminMarketAdapterPricingParams
              market={selectedMarket}
              isExpanded={isAdapterMarketPricingParamsExpanded}
              onClickExpand={() => setIsAdapterMarketPricingParamsExpanded(!isAdapterMarketPricingParamsExpanded)}
            />
            <AdminMarketCircuitBreakerParams
              market={selectedMarket}
              isExpanded={isCircuitBreakerParamsExpanded}
              onClickExpand={() => setIsCircuitBreakerParamsExpanded(!isCircuitBreakerParamsExpanded)}
            />
            <AdminMarketGuardianProcess
              market={selectedMarket}
              globalCache={selectedGlobalCache}
              isExpanded={isGuardianProcessExpanded}
              onClickExpand={() => setIsGuardianProcessExpanded(!isGuardianProcessExpanded)}
            />
            <Flex mt={2} mb={6} mr={6} ml="auto">
              <Button label="Expand All" onClick={() => setAllExpanded(true)} />
              <Button ml={2} label="Collapse All" onClick={() => setAllExpanded(false)} />
            </Flex>
          </CardBody>
        </Card>
        <AdminAddMarket globalOwner={selectedGlobalOwner} />
      </PageGrid>
    </Page>
  )
}

export default AdminPageHelper
