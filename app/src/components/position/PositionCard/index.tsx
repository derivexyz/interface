import Button from '@lyra/ui/components/Button'
import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Grid from '@lyra/ui/components/Grid'
import Text from '@lyra/ui/components/Text'
import formatDateTime from '@lyra/ui/utils/formatDateTime'
import formatNumber from '@lyra/ui/utils/formatNumber'
import formatUSD from '@lyra/ui/utils/formatUSD'
import { Option, Position } from '@lyrafinance/lyra-js'
import React, { useState } from 'react'

import PositionStatusText from '@/app/components/common/PositionStatusText'
import { UNIT, ZERO_BN } from '@/app/constants/bn'
import ShortYieldValue from '@/app/containers/common/ShortYieldValue'
import TradeCollateralFormModal from '@/app/containers/trade/TradeCollateralFormModal'
import TradeFormModal from '@/app/containers/trade/TradeFormModal'
import useWallet from '@/app/hooks/account/useWallet'
import isDev from '@/app/utils/isDev'

import LabelItem from '../../common/LabelItem'

type Props = {
  position: Position
  option: Option
}

const PositionCard = ({ position, option }: Props): JSX.Element | null => {
  const { unrealizedPnl, settlementPnl, realizedPnl } = position.pnl()
  const pnl = position.isOpen ? unrealizedPnl : position.isSettled ? settlementPnl : realizedPnl
  const currentPrice = position.pricePerOption
  const averageCost = position.averageCostPerOption()
  const size = position.size
  const equity = position.isLong ? currentPrice.mul(size).div(UNIT) : position?.collateral?.value ?? ZERO_BN

  const [isBuy, setIsBuy] = useState(false)
  const [isTradeFormOpen, setIsTradeFormOpen] = useState(false)
  const [isCollateralFormOpen, setIsCollateralFormOpen] = useState(false)

  const { account, isOverride } = useWallet()
  const isOwner = account === position.owner && !isOverride

  return (
    <Card flexGrow={1}>
      <CardBody height="100%">
        <Text variant="heading" mb={8}>
          Position
        </Text>
        <Grid
          flexGrow={1}
          sx={{ gridTemplateColumns: ['1fr 1fr', '1fr 1fr 1fr 1fr 1fr 1fr'], gap: [3, 6], gridRowGap: [6, 8] }}
        >
          {/* First row */}
          {!position.isOpen ? <LabelItem label="Status" value={<PositionStatusText position={position} />} /> : null}
          <LabelItem
            label="Contracts"
            valueColor={position.isLong ? 'primaryText' : 'errorText'}
            value={`${position.isLong ? 'LONG' : 'SHORT'} ${formatNumber(position.sizeBeforeClose())}`}
          />
          <LabelItem label="Equity" value={position.isOpen ? formatUSD(equity) : '-'} />
          <LabelItem label="Average Cost" value={averageCost.isZero() ? '-' : formatUSD(averageCost)} />
          {position.isOpen ? <LabelItem label="Current Price" value={formatUSD(currentPrice)} /> : null}
          <LabelItem
            label="Profit / Loss"
            value={formatUSD(pnl, { showSign: true })}
            valueColor={pnl.gte(0) ? 'primaryText' : 'errorText'}
          />
          <LabelItem label="Expiration" value={formatDateTime(position.expiryTimestamp, { hideYear: true })} />
          {/* Second row */}
          {position.isOpen && !position.isLong ? (
            <LabelItem
              label="Liquidation Price"
              value={position.collateral?.liquidationPrice ? formatUSD(position.collateral.liquidationPrice) : 'None'}
            />
          ) : null}
          {position.isOpen && !position.isLong ? (
            <LabelItem
              label="Yield / Day"
              value={<ShortYieldValue textVariant="secondary" tradeOrPosition={position} option={option} />}
            />
          ) : null}
        </Grid>
        {(isOwner || isDev()) && position.isOpen ? (
          <Grid mt={8} sx={{ gridTemplateColumns: ['1fr', '1fr 1fr 1fr 1fr 1fr'], gap: [3, 6] }}>
            <Button
              variant="primary"
              isOutline
              size="lg"
              label="Open Position"
              onClick={() => {
                setIsBuy(position.isLong)
                setIsTradeFormOpen(true)
              }}
            />
            <Button
              variant="error"
              size="lg"
              isOutline
              label="Close Position"
              onClick={() => {
                setIsBuy(!position.isLong)
                setIsTradeFormOpen(true)
              }}
            />
            {!position.isLong ? (
              <Button
                variant="light"
                isOutline
                size="lg"
                label="Adjust Collateral"
                onClick={() => setIsCollateralFormOpen(true)}
              />
            ) : null}
          </Grid>
        ) : null}
      </CardBody>
      <TradeFormModal
        isOpen={isTradeFormOpen}
        onClose={() => setIsTradeFormOpen(false)}
        onTrade={() => setIsTradeFormOpen(false)}
        isBuy={isBuy}
        position={position}
        option={option}
      />
      <TradeCollateralFormModal
        isOpen={isCollateralFormOpen}
        onClose={() => setIsCollateralFormOpen(false)}
        onTrade={() => setIsCollateralFormOpen(false)}
        position={position}
        option={option}
      />
    </Card>
  )
}

export default PositionCard
