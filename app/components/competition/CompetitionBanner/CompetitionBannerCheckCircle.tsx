import Box from '@lyra/ui/components/Box'
import Icon, { IconType } from '@lyra/ui/components/Icon'
import React from 'react'

const CHECKBOX_COLOR = '#60DDBF'

type Props = {
  isChecked: boolean
}

const CompetitionBannerCheckCircle = ({ isChecked }: Props) => {
  return (
    <Box
      minWidth={36}
      minHeight={36}
      sx={{ borderRadius: 'circle', position: 'relative', border: '1px solid', borderColor: CHECKBOX_COLOR }}
      bg={isChecked ? CHECKBOX_COLOR : null}
    >
      {isChecked ? (
        <Icon
          icon={IconType.Check}
          strokeWidth={3}
          size={48}
          color="white"
          sx={{ position: 'absolute', top: '45%', left: '50%', transform: 'translate(-40%, -50%)' }}
        />
      ) : null}
    </Box>
  )
}

export default CompetitionBannerCheckCircle
