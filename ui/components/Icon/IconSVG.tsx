import OneInchIcon from '@lyra/ui/components/Icon/1inchIcon'
import useThemeColor from '@lyra/ui/hooks/useThemeColor'
import useThemeValue from '@lyra/ui/hooks/useThemeValue'
import { ResponsiveValue } from '@lyra/ui/types'
import React from 'react'
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  BarChart,
  BarChart2,
  Book,
  Box,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Circle,
  Clock,
  Code,
  Copy,
  CornerDownRight,
  Database,
  DollarSign,
  Download,
  Droplet,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  Flag,
  Gift,
  GitCommit,
  GitHub,
  HelpCircle,
  Hexagon,
  Inbox,
  Info,
  Link2,
  Lock,
  Maximize2,
  Menu,
  Minimize2,
  Monitor,
  Moon,
  MoreHorizontal,
  PenTool,
  PieChart,
  Plus,
  PlusCircle,
  Settings,
  Share2,
  Shield,
  Slash,
  Star,
  Sun,
  ToggleLeft,
  ToggleRight,
  TrendingDown,
  TrendingUp,
  Twitter,
  Upload,
  X,
  XCircle,
  XSquare,
  Zap,
} from 'react-feather'

import CandleIcon from './CandleIcon'
import DiscordIcon from './DiscordIcon'
import DotIcon from './DotIcon'
import EthereumIcon from './EthereumIcon'
import ExpandIcon from './ExpandIcon'
import FlagIcon from './FlagIcon'
import MenuIcon from './MenuIcon'
import OptimismIcon from './OptimismIcon'
import RewardsIcon from './RewardsIcon'
import StackIcon from './StackIcon'
import SwapIcon from './SwapIcon'
import TriangleDownIcon from './TriangleDownIcon'
import TriangleUpIcon from './TriangleUpIcon'
import TwitterIcon from './TwitterIcon'
import UniswapIcon from './UniswapIcon'

export enum IconType {
  MoreHorizontal = 'MoreHorizontal',
  ArrowDown = 'ArrowDown',
  ArrowUp = 'ArrowUp',
  ArrowLeft = 'ArrowLeft',
  ArrowRight = 'ArrowRight',
  ArrowUpRight = 'ArrowUpRight',
  ExternalLink = 'ExternalLink',
  PlusCircle = 'PlusCircle',
  Plus = 'Plus',
  Info = 'Info',
  HelpCircle = 'HelpCircle',
  Twitter = 'Twitter',
  AlertTriangle = 'AlertTriangle',
  AlertCircle = 'AlertCircle',
  X = 'X',
  XSquare = 'XSquare',
  XCircle = 'XCircle',
  GitHub = 'GitHub',
  Copy = 'Copy',
  Circle = 'Circle',
  Flag = 'Flag',
  Activity = 'Activity',
  ChevronDown = 'ChevronDown',
  ChevronUp = 'ChevronUp',
  ChevronLeft = 'ChevronLeft',
  ChevronRight = 'ChevronRight',
  Discord = 'Discord',
  Check = 'Check',
  CheckCircle = 'CheckCircle',
  Monitor = 'Monitor',
  TrendingUp = 'TrendingUp',
  TrendingDown = 'TrendingDown',
  ToggleRight = 'ToggleRight',
  ToggleLeft = 'ToggleLeft',
  Optimism = 'Optimism',
  Moon = 'Moon',
  Sun = 'Sun',
  TriangleUp = 'TriangleUp',
  TriangleDown = 'TriangleDown',
  Settings = 'Settings',
  Eye = 'Eye',
  EyeOff = 'EyeOff',
  Dot = 'Dot',
  Uniswap = 'Uniswap',
  Kwenta = 'Kwenta',
  OneInch = 'OneInch',
  Slash = 'Slash',
  Book = 'Book',
  Swap = 'Swap',
  Lock = 'Lock',
  PieChart = 'PieChart',
  Clock = 'Clock',
  BarChart = 'BarChart',
  BarChart2 = 'BarChart2',
  Droplet = 'Droplet',
  Box = 'Box',
  Shield = 'Shield',
  Hexagon = 'Hexagon',
  Zap = 'Zap',
  Download = 'Download',
  Upload = 'Upload',
  Ethereum = 'Ethereum',
  Gift = 'Gift',
  CornerDownRight = 'CornerDownRight',
  Star = 'Star',
  Code = 'Code',
  PenTool = 'PenTool',
  Inbox = 'Inbox',
  DollarSign = 'DollarSign',
  MetaMask = 'MetaMask',
  Maximize2 = 'Maximize2',
  Minimize2 = 'Minimize2',
  Menu = 'Menu',
  Expand = 'Expand',
  Stack = 'Stack',
  Rewards = 'Rewards',
  FileText = 'FileText',
  Database = 'Database',
  Share2 = 'Share2',
  Refresh = 'RefreshCcw',
  Link2 = 'Link2',
  Candle = 'Candle',
  GitCommit = 'GitCommit',
}

export type CustomIconProps = {
  color: string
  size: number | string
}

export type SVGIconProps = {
  icon: IconType
  color?: string
  size?: ResponsiveValue
  strokeWidth?: ResponsiveValue
}

const getLocalIcon = (icon: IconType) => {
  switch (icon) {
    case IconType.Discord:
      return DiscordIcon
    case IconType.Twitter:
      return TwitterIcon
    case IconType.Optimism:
      return OptimismIcon
    case IconType.TriangleUp:
      return TriangleUpIcon
    case IconType.TriangleDown:
      return TriangleDownIcon
    case IconType.Dot:
      return DotIcon
    case IconType.Uniswap:
      return UniswapIcon
    case IconType.OneInch:
      return OneInchIcon
    case IconType.Swap:
      return SwapIcon
    case IconType.Ethereum:
      return EthereumIcon
    case IconType.Expand:
      return ExpandIcon
    case IconType.Menu:
      return MenuIcon
    case IconType.Stack:
      return StackIcon
    case IconType.Flag:
      return FlagIcon
    case IconType.Rewards:
      return RewardsIcon
    case IconType.Candle:
      return CandleIcon
    default:
      return null
  }
}

const getFeatherIcon = (icon: IconType) => {
  switch (icon) {
    case IconType.MoreHorizontal:
      return MoreHorizontal
    case IconType.ArrowDown:
      return ArrowDown
    case IconType.ArrowUp:
      return ArrowUp
    case IconType.ArrowLeft:
      return ArrowLeft
    case IconType.ArrowRight:
      return ArrowRight
    case IconType.ArrowUpRight:
      return ArrowUpRight
    case IconType.ExternalLink:
      return ExternalLink
    case IconType.PlusCircle:
      return PlusCircle
    case IconType.Plus:
      return Plus
    case IconType.Info:
      return Info
    case IconType.HelpCircle:
      return HelpCircle
    case IconType.Twitter:
      return Twitter
    case IconType.AlertTriangle:
      return AlertTriangle
    case IconType.AlertCircle:
      return AlertCircle
    case IconType.X:
      return X
    case IconType.XSquare:
      return XSquare
    case IconType.XCircle:
      return XCircle
    case IconType.GitHub:
      return GitHub
    case IconType.Copy:
      return Copy
    case IconType.Circle:
      return Circle
    case IconType.Flag:
      return Flag
    case IconType.Activity:
      return Activity
    case IconType.ChevronDown:
      return ChevronDown
    case IconType.ChevronUp:
      return ChevronUp
    case IconType.ChevronLeft:
      return ChevronLeft
    case IconType.ChevronRight:
      return ChevronRight
    case IconType.Check:
      return Check
    case IconType.CheckCircle:
      return CheckCircle
    case IconType.Monitor:
      return Monitor
    case IconType.TrendingUp:
      return TrendingUp
    case IconType.TrendingDown:
      return TrendingDown
    case IconType.ToggleRight:
      return ToggleRight
    case IconType.ToggleLeft:
      return ToggleLeft
    case IconType.Moon:
      return Moon
    case IconType.Sun:
      return Sun
    case IconType.Settings:
      return Settings
    case IconType.Eye:
      return Eye
    case IconType.EyeOff:
      return EyeOff
    case IconType.Slash:
      return Slash
    case IconType.Book:
      return Book
    case IconType.Lock:
      return Lock
    case IconType.PieChart:
      return PieChart
    case IconType.Clock:
      return Clock
    case IconType.BarChart:
      return BarChart
    case IconType.BarChart2:
      return BarChart2
    case IconType.Droplet:
      return Droplet
    case IconType.Box:
      return Box
    case IconType.Shield:
      return Shield
    case IconType.Hexagon:
      return Hexagon
    case IconType.Zap:
      return Zap
    case IconType.Download:
      return Download
    case IconType.Upload:
      return Upload
    case IconType.Gift:
      return Gift
    case IconType.CornerDownRight:
      return CornerDownRight
    case IconType.Star:
      return Star
    case IconType.Code:
      return Code
    case IconType.PenTool:
      return PenTool
    case IconType.Inbox:
      return Inbox
    case IconType.DollarSign:
      return DollarSign
    case IconType.Maximize2:
      return Maximize2
    case IconType.Minimize2:
      return Minimize2
    case IconType.Menu:
      return Menu
    case IconType.FileText:
      return FileText
    case IconType.Database:
      return Database
    case IconType.Share2:
      return Share2
    case IconType.Link2:
      return Link2
    case IconType.GitCommit:
      return GitCommit
    default:
      return null
  }
}

const LocalIcon = ({ icon, ...props }: SVGIconProps): JSX.Element | null => {
  const Component = getLocalIcon(icon)
  if (Component == null) {
    return null
  }
  return <Component {...(props as any)} />
}

export default function IconSVG({ icon, size, strokeWidth = 2, color = 'currentColor' }: SVGIconProps) {
  const customIconProps: CustomIconProps = {
    color: useThemeColor(color),
    size: useThemeValue(size),
  }
  const featherIconProps = {
    color: useThemeColor(color),
    size: useThemeValue(size),
    strokeWidth: useThemeValue(strokeWidth),
  }
  let iconEl: JSX.Element | null = null
  if (getLocalIcon(icon) != null) {
    iconEl = <LocalIcon icon={icon} {...customIconProps} />
  } else if (iconEl == null) {
    const FeatherIcon: React.FunctionComponent | null = getFeatherIcon(icon)
    if (FeatherIcon != null) {
      iconEl = <FeatherIcon {...(featherIconProps as any)} />
    }
  }
  return iconEl
}
