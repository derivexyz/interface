import Button from '@lyra/ui/components/Button'
import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Center from '@lyra/ui/components/Center'
import Flex from '@lyra/ui/components/Flex'
import Spinner from '@lyra/ui/components/Spinner'
import Text from '@lyra/ui/components/Text'
import { Market } from '@lyrafinance/lyra-js'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

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
import AdminMarketPoolHedgerParams from '@/app/containers/admin/AdminMarketPoolHedgerParams'
import AdminMarketPricingParams from '@/app/containers/admin/AdminMarketPricingParams'
import AdminMarketSelect from '@/app/containers/admin/AdminMarketSelect'
import AdminMarketShortBufferParams from '@/app/containers/admin/AdminMarketShortBufferParam'
import AdminMarketSpotPrice from '@/app/containers/admin/AdminMarketSpotPrice'
import AdminMarketTradeLimitParams from '@/app/containers/admin/AdminMarketTradeLimitParams'
import AdminMarketVarianceFeeParams from '@/app/containers/admin/AdminMarketVarianceFeeParams'
import AdminTransactionCard from '@/app/containers/admin/AdminTransactionCard'
import withSuspense from '@/app/hooks/data/withSuspense'
import { useMutateMarket } from '@/app/hooks/market/useMarket'
import useMarketOwner from '@/app/hooks/market/useMarketOwner'
import getPagePath from '@/app/utils/getPagePath'

import Layout from '../common/Layout'
import LayoutGrid from '../common/Layout/LayoutGrid'
import LayoutPageError from '../common/Layout/LayoutPageError'

type Props = {
  market: Market | null
}

const AdminMarketPageHelper = withSuspense(
  ({ market }: Props) => {
    const mutateMarket = useMutateMarket(market?.name ?? null)
    const router = useRouter()
    const owner = useMarketOwner(market?.name ?? null)
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

    useEffect(() => {
      if (market) {
        // Prefetch pages to avoid slow switching
        Promise.all(
          market
            .liveBoards()
            .map(board =>
              router.prefetch(
                getPagePath({ page: PageId.AdminBoard, marketAddressOrName: market.name, boardId: board.id })
              )
            )
        )
      }
    }, [market, router])

    if (!market || !owner) {
      return <LayoutPageError error="Market does not exist" />
    }

    return (
      <Layout
        desktopRightColumn={<AdminTransactionCard height="80vh" overflow="auto" />}
        showBackButton
        backHref={getPagePath({ page: PageId.Admin })}
      >
        <LayoutGrid>
          <AdminMarketSelect marketAddressOrName={market.name} />
          <AdminMarketSpotPrice market={market} />
          <AdminMarketPauseButton market={market} owner={owner} />
          <AdminMarketBoardsInfo market={market} />
          <AdminMarketAddBoard market={market} owner={owner} onAddBoard={mutateMarket} />
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
                onParamUpdate={mutateMarket}
              />
              <AdminMarketForceCloseParams
                market={market}
                isExpanded={isForceCloseExpanded}
                onClickExpand={() => setIsForceCloseExpanded(!isForceCloseExpanded)}
                onParamUpdate={mutateMarket}
              />
              <AdminMarketMinCollateralParams
                market={market}
                isExpanded={isMinCollateralExpanded}
                onClickExpand={() => setIsMinCollateralExpanded(!isMinCollateralExpanded)}
                onParamUpdate={mutateMarket}
              />
              <AdminMarketOptionMarketParams
                market={market}
                isExpanded={isOptionMarketExpanded}
                onClickExpand={() => setIsOptionMarketExpanded(!isOptionMarketExpanded)}
                onParamUpdate={mutateMarket}
              />
              <AdminMarketLpParams
                market={market}
                isExpanded={isLPExpanded}
                onClickExpand={() => setIsLPExpanded(!isLPExpanded)}
                onParamUpdate={mutateMarket}
              />
              <AdminMarketPartialCollatParams
                market={market}
                isExpanded={isPartialCollatExpanded}
                onClickExpand={() => setIsPartialCollatExpanded(!isPartialCollatExpanded)}
                onParamUpdate={mutateMarket}
              />
              <AdminMarketPoolHedgerParams
                market={market}
                isExpanded={isPoolHedgerExpanded}
                onClickExpand={() => setIsPoolHedgerExpanded(!isPoolHedgerExpanded)}
                onParamUpdate={mutateMarket}
              />
              <AdminMarketShortBufferParams
                market={market}
                isExpanded={isShortBufferExpanded}
                onClickExpand={() => setIsShortBufferExpanded(!isShortBufferExpanded)}
                onParamUpdate={mutateMarket}
              />
              <AdminMarketPricingParams
                market={market}
                isExpanded={isPricingExpanded}
                onClickExpand={() => setIsPricingExpanded(!isPricingExpanded)}
                onParamUpdate={mutateMarket}
              />
              <AdminMarketVarianceFeeParams
                market={market}
                isExpanded={isVarianceFeesExpanded}
                onClickExpand={() => setIsVarianceFeesExpanded(!isVarianceFeesExpanded)}
                onParamUpdate={mutateMarket}
              />
              <AdminMarketTradeLimitParams
                market={market}
                isExpanded={isTradeLimitExpanded}
                onClickExpand={() => setIsTradeLimitExpanded(!isTradeLimitExpanded)}
                onParamUpdate={mutateMarket}
              />
              <AdminMarketGuardianProcess
                market={market}
                isExpanded={isGuardianProcessExpanded}
                onClickExpand={() => setIsGuardianProcessExpanded(!isGuardianProcessExpanded)}
                onParamUpdate={mutateMarket}
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
        </LayoutGrid>
      </Layout>
    )
  },
  () => {
    return (
      <Layout>
        <Center width="100%" height="100%">
          <Spinner />
        </Center>
      </Layout>
    )
  }
)

export default AdminMarketPageHelper
