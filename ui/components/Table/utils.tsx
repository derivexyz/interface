import React from 'react'
import { Box } from 'rebass'

import Icon, { IconType } from '../Icon/IconSVG'
import { TableRecordType } from '.'

export function getExpandColumnSettings<T extends TableRecordType>() {
  return {
    id: 'expander',
    maxWidth: 45,
    minWidth: 45,
    width: 45,
    Header: function renderHeaderCell() {
      return <span></span>
    },
    Cell: function renderCell({ row, state: { rowState }, setRowState }: any) {
      const canExpand = row.original.expandedRowComponents?.length
      if (!canExpand) {
        return null
      }

      const { id } = row
      const { expanded } = (rowState[id] || {}) as any

      return (
        <span
          onClick={() => {
            setRowState([row.id], {
              expanded: expanded ? false : true,
            })
          }}
        >
          <Box
            sx={{
              '&:hover': {
                cursor: 'pointer',
              },
            }}
          >
            {expanded ? <Icon icon={IconType.ChevronUp} size={20} /> : <Icon icon={IconType.ChevronDown} size={20} />}
          </Box>
        </span>
      )
    },
  }
}
