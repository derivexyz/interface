import { ButtonVariant } from '@lyra/ui/components/Button'

export type Announcement = {
  id: string
  title: string
  description: string
  cta: {
    label: string
    href: string
    variant: ButtonVariant
    target?: '_self' | '_blank'
  }
  graphic?: string
  startTimestamp: number
  expiryTimestamp: number
}

const ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'arbitrum-airdrop',
    title: '400k $ARB Airdrop',
    description: 'The Lyra DAO is airdropping 400k $ARB to traders and LPs over 8 weeks.',
    cta: {
      label: 'Learn More',
      href: '/airdrop/arbitrum',
      variant: 'default',
    },
    graphic: 'images/arbitrum.png',
    startTimestamp: 1683131266,
    expiryTimestamp: 1688047200,
  },
]

export default ANNOUNCEMENTS
