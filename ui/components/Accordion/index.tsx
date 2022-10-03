import useThemeColor from '@lyra/ui/hooks/useThemeColor'
import React from 'react'
import { Accordion as AccessibleAccordion } from 'react-accessible-accordion'
import styled from 'styled-components'

const StyledAccordion = styled(AccessibleAccordion)<{ panelheight: number; numitems: number }>`
  .accordion {
    max-height: ${props => props.numitems * 55 + props.panelheight}px;
    border-bottom: 0px solid black;
  }

  .accordion__item:first-of-type {
    border-top: 1px solid ${props => props.theme.hoverBackground};
  }

  .accordion__item {
    border-bottom: 1px solid ${props => props.theme.hoverBackground};
  }

  .accordion__button {
    cursor: pointer;
    padding: 24px;
    width: 100%;
    text-align: left;
    border: none;
    border-bottom: 1px solid ${props => props.theme.hoverBackground};
  }

  .accordion__button:hover {
    background-color: ${props => props.theme.hoverBackground};
  }

  .accordion__button[aria-expanded='true'] {
    background: ${props => props.theme.selectedBackground};
  }

  .accordion__button.disabled {
    background: ${props => props.theme.disabled};
    cursor: not-allowed;
  }

  .accordion__panel[hidden] {
    display: block;
    max-height: 0px;
    overflow: hidden;
    opacity: 0;
    transition: all 0.1s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .accordion__panel {
    opacity: 1;
    max-height: ${props => props.panelheight}px;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
  }
`

type Props = {
  children: React.ReactElement[]
  panelHeight: number
  preExpanded?: string[]
  disableTabs?: string[]
}

export default function Accordion({ children, panelHeight, preExpanded }: Props) {
  const background = useThemeColor('background')
  const hoverBackground = useThemeColor('listItemHover')
  const selectedBackground = useThemeColor('selected')
  const disabled = useThemeColor('disabled')
  return (
    <StyledAccordion
      theme={{ background, hoverBackground, selectedBackground, disabled }}
      sx={{ background: 'background' }}
      preExpanded={preExpanded}
      panelheight={panelHeight}
      numitems={children.length}
    >
      {children}
    </StyledAccordion>
  )
}
