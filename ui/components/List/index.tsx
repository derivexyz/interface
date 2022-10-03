import React from 'react'
import { Box } from 'rebass'
import { LayoutProps, MarginProps } from 'styled-system'

import { ListItemProps } from './ListItem'

export type ListProps = {
  children?: React.ReactElement<ListItemProps> | (React.ReactElement<ListItemProps> | null)[] | null
} & LayoutProps &
  MarginProps

export type ListElement = React.ReactElement<ListProps>

export default function List({ children, ...styleProps }: ListProps): ListElement {
  return (
    <Box variant="list" as="ul" {...styleProps}>
      {children}
    </Box>
  )
}
