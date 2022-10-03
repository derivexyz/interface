import Card, { CardElement } from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Shimmer from '@lyra/ui/components/Shimmer'
import ButtonShimmer from '@lyra/ui/components/Shimmer/ButtonShimmer'
import Spinner from '@lyra/ui/components/Spinner'
import { MarginProps } from '@lyra/ui/types'
import React from 'react'

export default function LoadingDemoCard({ ...marginProps }: MarginProps): CardElement {
  return (
    <Card {...marginProps}>
      <CardBody>
        <Shimmer width={400} height={48} my={2} />
        <Shimmer width={800} height={200} my={2} />
        <ButtonShimmer width={400} size="md" my={2} />
        <ButtonShimmer width={400} size="md" my={2} />
        <Spinner size="sm" variant="primary" my={2} />
        <Spinner size="md" variant="primary" my={2} />
        <Spinner size="lg" variant="primary" my={2} />
        <Spinner size="sm" variant="light" my={2} />
        <Spinner size="md" variant="light" my={2} />
        <Spinner size="lg" variant="light" my={2} />
      </CardBody>
    </Card>
  )
}
