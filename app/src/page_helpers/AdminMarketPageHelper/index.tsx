import Button from '@lyra/ui/components/Button'
import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Flex from '@lyra/ui/components/Flex'
import Text from '@lyra/ui/components/Text'
import { Market } from '@lyrafinance/lyra-js'
import React, { useState } from 'react'

import { PageId } from '@/app/constants/pages'
import AdminMarketAddBoard from '@/app/containers/admin/AdminMarketAddBoard'
import AdminMarketBoardsInfo from '@/app/containers/admin/AdminMarketBoardsInfo'
import AdminMarketForceCloseParams from '@/app/containers/admin/AdminMarketForceCloseParams'
import AdminMarketGreekCacheParams from '@/app/containers/admin/AdminMarketGreekCacheParams'
import AdminMarketGuardianProcess from '@/app/containers/admin/AdminMarketGuardianProcess'
import AdminMarketLpParams from '@/app/containers/admin/AdminMarketLpParams'
import AdminMarketMinCollateralParams from '@/app/containers/admin/AdminMarketMinCollateralParams'
import AdminMarketOptionMarketParams from '@/app/containers/admin/AdminMarketOptionMarketParams'
import AdminMarketPartialCollatParams from '@/app/containers/admin/AdminMarketPartialCollatParams'
import AdminMarketPauseButton from '@/app/containers/admin/AdminMarketPauseButton'
import AdminMarketPricingParams from '@/app/containers/admin/AdminMarketPricingParams'
import AdminMarketSelect from '@/app/containers/admin/AdminMarketSelect'
import AdminMarketTradeLimitParams from '@/app/containers/admin/AdminMarketTradeLimitParams'
import AdminMarketVarianceFeeParams from '@/app/containers/admin/AdminMarketVarianceFeeParams'
import AdminTransactionCard from '@/app/containers/admin/AdminTransactionCard'
import withSuspense from '@/app/hooks/data/withSuspense'
import useMarketOwner from '@/app/hooks/market/useMarketOwner'
import { useMutateMarkets } from '@/app/hooks/market/useMarkets'
import getPagePath from '@/app/utils/getPagePath'

import Page from '../common/Page'
import PageError from '../common/Page/PageError'
import PageGrid from '../common/Page/PageGrid'
import PageLoading from '../common/Page/PageLoading'

type Props = {
  market: Market
}

const AdminMarketPageHelper = withSuspense(
  ({ market }: Props) => {
    const mutateMarkets = useMutateMarkets()
    const owner = useMarketOwner(market)
    const [isGreekCacheExpanded, setIsGreekCacheExpanded] = useState(false)
    const [isForceCloseExpanded, setIsForceCloseExpanded] = useState(false)
    const [isMinCollateralExpanded, setIsMinCollateralExpanded] = useState(false)
    const [isOptionMarketExpanded, setIsOptionMarketExpanded] = useState(false)
    const [isLPExpanded, setIsLPExpanded] = useState(false)
    const [isPartialCollatExpanded, setIsPartialCollatExpanded] = useState(false)
    const [isPoolHedgerExpanded, setIsPoolHedgerExpanded] = useState(false)
    const [isShortBufferExpanded, setIsShortBufferExpanded] = useState(false)
    const [isPricingExpanded, setIsPricingExpanded] = useState(false)
    const [isVarianceFeesExpanded, setIsVarianceFeesExpanded] = useState(false)
    const [isTradeLimitExpanded, setIsTradeLimitExpanded] = useState(false)
    const [isGuardianProcessExpanded, setIsGuardianProcessExpanded] = useState(false)

    if (!market || !owner) {
      return <PageError error="Market does not exist" />
    }

    return (
      <Page
        desktopRightColumn={<AdminTransactionCard height="80vh" overflow="auto" />}
        showBackButton
        backHref={getPagePath({ page: PageId.Admin })}
      >
        <PageGrid>
          <AdminMarketSelect marketAddressOrName={market.name} />
          <AdminMarketPauseButton market={market} owner={owner} />
          <AdminMarketBoardsInfo market={market} />
          <AdminMarketAddBoard market={market} owner={owner} onAddBoard={mutateMarkets} />
          <Card flexDirection="column" mx={8} mt={4} mb={64}>
            <CardBody noPadding>
              <Flex my={6} mx={6} mb={4}>
                <Text variant="heading">Market Parameters</Text>
                <Flex ml="auto">
                  <Button
                    variant="primary"
                    label="Expand All"
                    onClick={() => {
                      setIsGreekCacheExpanded(true)
                      setIsForceCloseExpanded(true)
                      setIsMinCollateralExpanded(true)
                      setIsOptionMarketExpanded(true)
                      setIsLPExpanded(true)
                      setIsPartialCollatExpanded(true)
                      setIsPoolHedgerExpanded(true)
                      setIsShortBufferExpanded(true)
                      setIsPricingExpanded(true)
                      setIsVarianceFeesExpanded(true)
                      setIsTradeLimitExpanded(true)
                      setIsGuardianProcessExpanded(true)
                    }}
                  />
                  <Button
                    ml={2}
                    label="Collapse All"
                    onClick={() => {
                      setIsGreekCacheExpanded(false)
                      setIsForceCloseExpanded(false)
                      setIsMinCollateralExpanded(false)
                      setIsOptionMarketExpanded(false)
                      setIsLPExpanded(false)
                      setIsPartialCollatExpanded(false)
                      setIsPoolHedgerExpanded(false)
                      setIsShortBufferExpanded(false)
                      setIsPricingExpanded(false)
                      setIsVarianceFeesExpanded(false)
                      setIsTradeLimitExpanded(false)
                      setIsGuardianProcessExpanded(false)
                    }}
                  />
                </Flex>
              </Flex>
              <AdminMarketGreekCacheParams
                market={market}
                isExpanded={isGreekCacheExpanded}
                onClickExpand={() => setIsGreekCacheExpanded(!isGreekCacheExpanded)}
                onParamUpdate={mutateMarkets}
              />
              <AdminMarketForceCloseParams
                market={market}
                isExpanded={isForceCloseExpanded}
                onClickExpand={() => setIsForceCloseExpanded(!isForceCloseExpanded)}
                onParamUpdate={mutateMarkets}
              />
              <AdminMarketMinCollateralParams
                market={market}
                isExpanded={isMinCollateralExpanded}
                onClickExpand={() => setIsMinCollateralExpanded(!isMinCollateralExpanded)}
                onParamUpdate={mutateMarkets}
              />
              <AdminMarketOptionMarketParams
                market={market}
                isExpanded={isOptionMarketExpanded}
                onClickExpand={() => setIsOptionMarketExpanded(!isOptionMarketExpanded)}
                onParamUpdate={mutateMarkets}
              />
              <AdminMarketLpParams
                market={market}
                isExpanded={isLPExpanded}
                onClickExpand={() => setIsLPExpanded(!isLPExpanded)}
                onParamUpdate={mutateMarkets}
              />
              <AdminMarketPartialCollatParams
                market={market}
                isExpanded={isPartialCollatExpanded}
                onClickExpand={() => setIsPartialCollatExpanded(!isPartialCollatExpanded)}
                onParamUpdate={mutateMarkets}
              />
              <AdminMarketPricingParams
                market={market}
                isExpanded={isPricingExpanded}
                onClickExpand={() => setIsPricingExpanded(!isPricingExpanded)}
                onParamUpdate={mutateMarkets}
              />
              <AdminMarketVarianceFeeParams
                market={market}
                isExpanded={isVarianceFeesExpanded}
                onClickExpand={() => setIsVarianceFeesExpanded(!isVarianceFeesExpanded)}
                onParamUpdate={mutateMarkets}
              />
              <AdminMarketTradeLimitParams
                market={market}
                isExpanded={isTradeLimitExpanded}
                onClickExpand={() => setIsTradeLimitExpanded(!isTradeLimitExpanded)}
                onParamUpdate={mutateMarkets}
              />
              <AdminMarketGuardianProcess
                market={market}
                isExpanded={isGuardianProcessExpanded}
                onClickExpand={() => setIsGuardianProcessExpanded(!isGuardianProcessExpanded)}
                onParamUpdate={mutateMarkets}
              />
              <Flex mb={6} mr={6} ml="auto">
                <Button
                  variant="primary"
                  label="Expand All"
                  onClick={() => {
                    setIsGreekCacheExpanded(true)
                    setIsForceCloseExpanded(true)
                    setIsMinCollateralExpanded(true)
                    setIsOptionMarketExpanded(true)
                    setIsLPExpanded(true)
                    setIsPartialCollatExpanded(true)
                    setIsPoolHedgerExpanded(true)
                    setIsShortBufferExpanded(true)
                    setIsPricingExpanded(true)
                    setIsVarianceFeesExpanded(true)
                    setIsTradeLimitExpanded(true)
                    setIsGuardianProcessExpanded(true)
                  }}
                />
                <Button
                  ml={2}
                  label="Collapse All"
                  onClick={() => {
                    setIsGreekCacheExpanded(false)
                    setIsForceCloseExpanded(false)
                    setIsMinCollateralExpanded(false)
                    setIsOptionMarketExpanded(false)
                    setIsLPExpanded(false)
                    setIsPartialCollatExpanded(false)
                    setIsPoolHedgerExpanded(false)
                    setIsShortBufferExpanded(false)
                    setIsPricingExpanded(false)
                    setIsVarianceFeesExpanded(false)
                    setIsTradeLimitExpanded(false)
                    setIsGuardianProcessExpanded(false)
                  }}
                />
              </Flex>
            </CardBody>
          </Card>
        </PageGrid>
      </Page>
    )
  },
  () => {
    return <PageLoading />
  }
)

export default AdminMarketPageHelper
