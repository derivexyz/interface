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

import { UNIT, ZERO_BN } from '@/app/constants/bn'
import ShortYieldValue from '@/app/containers/common/ShortYieldValue'
import TradeFormModal from '@/app/containers/trade/TradeFormModal'
import useWallet from '@/app/hooks/wallet/useWallet'

import LabelItem from '../../common/LabelItem'
import PositionStatusToken from '../../common/PositionStatusToken'

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
  const [isOpen, setIsOpen] = useState(false)

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
          sx={{ gridTemplateColumns: ['1fr 1fr', '1fr 1fr 1fr 1fr'], gap: [3, 6], gridRowGap: [6, 8] }}
        >
          {/* First row */}
          {!position.isOpen ? <LabelItem label="Status" value={<PositionStatusToken position={position} />} /> : null}
          <LabelItem
            label="Contracts"
            valueColor={position.isLong ? 'primaryText' : 'errorText'}
            valueTextVariant="secondaryMedium"
            value={`${position.isLong ? 'LONG' : 'SHORT'} ${formatNumber(position.sizeBeforeClose())}`}
          />
          <LabelItem label="Average Cost" value={averageCost.isZero() ? '-' : formatUSD(averageCost)} />
          {position.isOpen ? <LabelItem label="Current Price" value={formatUSD(currentPrice)} /> : null}
          <LabelItem
            label="Profit / Loss"
            value={formatUSD(pnl, { showSign: true })}
            valueColor={pnl.gte(0) ? 'primaryText' : 'errorText'}
          />
          {/* Second row */}
          {position.isOpen ? <LabelItem label="Equity" value={formatUSD(equity)} /> : null}
          <LabelItem label="Expiration" value={formatDateTime(position.expiryTimestamp, true)} />
          {position.isOpen && !position.isLong ? (
            <LabelItem
              label="Liq. Price"
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
        <Grid mt={8} sx={{ gridTemplateColumns: ['1fr', '1fr 1fr 1fr'], gap: [3, 6] }}>
          {isOwner ? (
            position.isOpen ? (
              <>
                <Button
                  variant="primary"
                  isOutline
                  size="lg"
                  label="Open Position"
                  onClick={() => {
                    setIsBuy(position.isLong)
                    setIsOpen(true)
                  }}
                />
                <Button
                  variant="error"
                  isOutline
                  size="lg"
                  label="Close Position"
                  onClick={() => {
                    setIsBuy(!position.isLong)
                    setIsOpen(true)
                  }}
                />
              </>
            ) : (
              <Button size="lg" isDisabled label="Position Closed" />
            )
          ) : (
            <Button size="lg" isDisabled label="Not Owner" />
          )}
        </Grid>
      </CardBody>

      <TradeFormModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onTrade={() => setIsOpen(false)}
        isBuy={isBuy}
        positionId={position?.id}
        option={option}
      />
    </Card>
  )
}

export default PositionCard
