import emptyFunction from '@lyra/ui/utils/emptyFunction'
import React from 'react'
import ReactCollapsible from 'react-collapsible'

import Flex, { FlexProps } from '../Flex'

export type CollapsibleProps = {
  isExpanded: boolean
  isSelected?: boolean
  header?: React.ReactElement | null
  children?: React.ReactNode
  onClick?: React.ReactEventHandler<HTMLDivElement>
  onClickHeader?: React.ReactEventHandler<HTMLDivElement>
  noPadding?: boolean
} & FlexProps

export default function Collapsible({
  isExpanded,
  header,
  children,
  onClick,
  onClickHeader,
  noPadding,
  isSelected,
  ...flexProps
}: CollapsibleProps) {
  const isHeaderClickable = !!onClick || !!onClickHeader
  return (
    <ReactCollapsible
      trigger={
        <Flex
          py={noPadding ? 0 : 4}
          px={noPadding ? 0 : 6}
          alignItems="center"
          sx={{
            cursor: isHeaderClickable ? 'pointer' : undefined,
            ':hover': isHeaderClickable && !isSelected ? { bg: 'hover' } : undefined,
            ':active': isHeaderClickable && !isSelected ? { bg: 'active' } : undefined,
            bg: isSelected ? 'active' : undefined,
          }}
          onClick={onClickHeader ? onClickHeader : onClick}
        >
          {header}
        </Flex>
      }
      handleTriggerClick={emptyFunction}
      open={isExpanded}
      width="100%"
      easing="ease-out"
      transitionTime={100}
    >
      <Flex
        onClick={onClick}
        overflow="auto"
        flexDirection={'column'}
        sx={{
          cursor: isSelected ? 'pointer' : undefined,
          bg: isSelected ? 'active' : undefined,
        }}
        {...flexProps}
      >
        {children}
      </Flex>
    </ReactCollapsible>
  )
}
