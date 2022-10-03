import React from 'react'

import CardSection, { CardSectionProps } from '../Card/CardSection'

type Props = CardSectionProps

export default function ModalSection({ ...props }: Props) {
  return <CardSection {...props}></CardSection>
}
