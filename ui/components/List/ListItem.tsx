import Text from '@lyra/ui/components/Text'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import React from 'react'
import { Box, Flex, SxStyleProp } from 'rebass'

import Center from '../Center'
import { IconType } from '../Icon'
import IconOrImage from '../Icon/IconOrImage'
import BaseLink from '../Link/BaseLink'

export type ListItemProps = {
  label: React.ReactNode | string
  sublabel?: React.ReactNode | string | null
  icon?: IconType | string | React.ReactNode | null
  rightContent?: IconType | string | React.ReactNode | null
  onClick?: (e: any) => void
  isDisabled?: boolean
  target?: string
  href?: string
  children?: React.ReactNode
  sx?: SxStyleProp
}

export type ListItemElement = React.ReactElement<ListItemProps>

export default function ListItem({
  label,
  sublabel,
  icon,
  rightContent,
  onClick,
  isDisabled,
  target,
  href,
  children,
  sx,
}: ListItemProps): ListItemElement {
  const isMobile = useIsMobile()
  return (
    <>
      <Box
        as="li"
        overflow="hidden"
        variant="listItem"
        className={isDisabled ? 'disabled' : undefined}
        sx={{
          cursor: isDisabled ? 'not-allowed' : 'pointer',
        }}
        onClick={onClick}
      >
        <Flex
          as={href ? BaseLink : 'div'}
          href={href}
          target={target}
          alignItems="center"
          justifyContent="flex-start"
          // TODO: @dappbeast set all mobile px to 3px
          px={[6, 3]}
          py={3}
          height="100%"
          sx={{
            textDecoration: 'none',
            color: isDisabled ? 'disabledText' : 'text',
            ':hover': {
              color: isDisabled ? 'disabledText' : 'text',
            },
            ...sx,
          }}
        >
          {icon ? (
            <Center mr={2}>
              {typeof icon === 'string' ? <IconOrImage src={icon} size={18} color="currentColor" /> : icon}
            </Center>
          ) : null}
          <Flex flexGrow={1} flexDirection="column">
            {typeof label === 'string' || typeof label === 'number' ? (
              <Text variant={isMobile ? 'secondary' : 'body'} sx={{ transition: 'all 0.05s ease-out' }}>
                {label}
              </Text>
            ) : (
              label
            )}
            {sublabel != null &&
              (typeof sublabel === 'string' || typeof sublabel === 'number' ? (
                <Text variant="small">{sublabel}</Text>
              ) : (
                sublabel
              ))}
          </Flex>
          {rightContent ? (
            <Center height="100%" pl={8}>
              <Box>
                {typeof rightContent === 'string' ? <IconOrImage src={rightContent} size={18} /> : rightContent}
              </Box>
            </Center>
          ) : null}
        </Flex>
      </Box>
      {children}
    </>
  )
}
