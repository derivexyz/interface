import useIsDarkMode from '@lyra/ui/hooks/useIsDarkMode'
import useThemeColor from '@lyra/ui/hooks/useThemeColor'
import formatDate from '@lyra/ui/utils/formatDate'
import formatNumber from '@lyra/ui/utils/formatNumber'
import formatUSD from '@lyra/ui/utils/formatUSD'
import { Position } from '@lyrafinance/lyra-js'
import React from 'react'

import PayoffChart from '@/app/components/common/PayoffChart'
import formatTokenName from '@/app/utils/formatTokenName'
import fromBigNumber from '@/app/utils/fromBigNumber'

const VIEW_BOX_HEIGHT = 350
const PADDING_X = 8 * 4
const PADDING_Y = 8 * 4

type Props = {
  position: Position
  width: number
  height: number
}

export default function PositionShareSVG({ position, width, height }: Props) {
  const market = position.market()
  const strikePrice = fromBigNumber(position.strikePrice)

  const { unrealizedPnl, settlementPnl, realizedPnl } = position.pnl()
  const pnl = position.isOpen
    ? fromBigNumber(unrealizedPnl)
    : position.isSettled
    ? fromBigNumber(settlementPnl)
    : fromBigNumber(realizedPnl)

  const isLong = position.isLong
  const isCall = position.isCall

  const status = position.isOpen
    ? null
    : position.isLiquidated
    ? 'Liquidated'
    : position.isSettled
    ? position.isInTheMoney
      ? 'Settled'
      : 'Expired'
    : 'Closed'

  // Formatted
  const formattedSize = formatNumber(position.size, { maxDps: 2 })

  const longShortText = isLong ? 'LONG' : 'SHORT'
  const callPutText = isCall ? 'Call' : 'Put'
  const optionText = `${formatTokenName(market.baseToken)} $${strikePrice} ${callPutText}`
  const expiryText = `${formatDate(position.expiryTimestamp, true)} Exp`
  const positionText = `${longShortText} ${formattedSize}`

  const aspectRatio = height > 0 ? width / height : 1
  const viewBoxWidth = aspectRatio * VIEW_BOX_HEIGHT

  const maxPayoffChartWidth = viewBoxWidth - PADDING_X * 2
  const payoffChartWidth = Math.min(maxPayoffChartWidth, 448)

  const textColor = useThemeColor('text')
  const primaryTextColor = useThemeColor('primaryText')
  const secondaryTextColor = useThemeColor('secondaryText')
  const errorTextColor = useThemeColor('errorText')
  const cardBg = useThemeColor('tradeShareBg')

  const [isDarkMode] = useIsDarkMode()

  return (
    <svg
      width={width}
      height={height}
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox={`0 0 ${viewBoxWidth} ${VIEW_BOX_HEIGHT}`}
      fill="none"
    >
      <style>{`
        @import url('https://rsms.me/inter/inter.css');
        text {
          font-family: "Inter var", sans-serif;
        }
      `}</style>
      <rect width={viewBoxWidth} height={VIEW_BOX_HEIGHT} fill={cardBg} />
      <g opacity="0.22" filter="url(#filter0_f_403_206)">
        <mask id="path-3-inside-1_403_206" fill="white">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.00051811 56.7845V380.806H252.867C272.852 321.21 268.427 263.706 210.339 240.129C107.528 198.4 100.451 131.439 95.4317 83.95C92.0018 51.4983 89.533 28.1396 58.1327 28.1396C36.1584 28.1396 16.6585 38.7348 0.00051811 56.7845Z"
          />
        </mask>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0.00051811 56.7845V380.806H252.867C272.852 321.21 268.427 263.706 210.339 240.129C107.528 198.4 100.451 131.439 95.4317 83.95C92.0018 51.4983 89.533 28.1396 58.1327 28.1396C36.1584 28.1396 16.6585 38.7348 0.00051811 56.7845Z"
          fill="#00FFFF"
        />
        <path
          d="M0.00051811 56.7845H-3.99948V55.2208L-2.93896 54.0717L0.00051811 56.7845ZM0.00051811 380.806V384.806H-3.99948V380.806H0.00051811ZM252.867 380.806L256.66 382.078L255.745 384.806H252.867V380.806ZM210.339 240.129L208.835 243.836L208.835 243.836L210.339 240.129ZM95.4317 83.95L91.4539 84.3704L91.4539 84.3704L95.4317 83.95ZM4.00052 56.7845V380.806H-3.99948V56.7845H4.00052ZM0.00051811 376.806H252.867V384.806H0.00051811V376.806ZM249.075 379.534C258.946 350.099 262.617 321.642 256.988 297.883C251.418 274.372 236.681 255.138 208.835 243.836L211.844 236.423C242.085 248.698 258.605 270.004 264.773 296.038C270.882 321.824 266.774 351.917 256.66 382.078L249.075 379.534ZM208.835 243.836C156.709 222.679 128.459 194.939 112.704 166.118C97.0241 137.436 93.9581 108.064 91.4539 84.3704L99.4096 83.5295C101.925 107.325 104.907 135.178 119.723 162.281C134.464 189.245 161.158 215.851 211.844 236.423L208.835 243.836ZM91.4539 84.3704C89.7091 67.862 88.2662 54.7678 83.6967 45.6709C81.4933 41.2843 78.6306 38.0012 74.7348 35.766C70.8017 33.5095 65.4981 32.1396 58.1327 32.1396V24.1396C66.4675 24.1396 73.2476 25.6896 78.7159 28.827C84.2215 31.9857 88.078 36.5704 90.8455 42.0799C96.218 52.7753 97.7245 67.5862 99.4096 83.5295L91.4539 84.3704ZM58.1327 32.1396C37.5762 32.1396 19.0726 42.0169 2.94 59.4973L-2.93896 54.0717C14.2443 35.4528 34.7405 24.1396 58.1327 24.1396V32.1396Z"
          fill="#60DDBF"
          mask="url(#path-3-inside-1_403_206)"
        />
      </g>
      {isDarkMode ? (
        <path
          transform="scale(0.94),translate(-48,28)"
          d="M345.581 12.7282L345.58 12.7276C345.043 11.4601 344.208 10.7964 343.349 10.6394C342.49 10.4824 341.473 10.8079 340.522 11.7988L345.581 12.7282ZM345.581 12.7282L358.5 43.0655C359.04 44.3379 359.15 45.9197 358.867 47.4538C358.584 48.9879 357.916 50.4254 356.956 51.4199L356.953 51.4233L338.369 71.0493L295.995 71.0493L295.989 71.0494C294.331 71.0689 292.864 70.9243 291.688 70.611C290.504 70.2953 289.669 69.8236 289.201 69.2331C288.754 68.6701 288.59 67.9351 288.879 66.9397C289.174 65.9217 289.941 64.6506 291.348 63.1076L340.522 11.7991L345.581 12.7282ZM281.437 77.0831L296.647 112.747C298.543 117.193 302.628 118.398 307.275 118.692H386.208C387.578 118.692 388.513 118.186 388.994 117.459C389.474 116.733 389.574 115.674 389.037 114.412L376.264 84.4502C376.264 84.45 376.264 84.4498 376.264 84.4496C375.719 83.1828 374.656 82.012 373.357 81.1563C372.057 80.3005 370.563 79.7872 369.188 79.7872L292.155 79.7872L292.154 79.7872M281.437 77.0831L292.154 79.7872M281.437 77.0831C281.98 77.5106 282.616 77.909 283.369 78.2615C285.364 79.1958 288.149 79.7929 292.154 79.7872M281.437 77.0831L292.154 79.7872"
          fill="#69D8BD"
          fillOpacity="0.06"
          stroke="url(#paint0_linear_403_206)"
        />
      ) : (
        <path
          opacity="0.1"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M220 82.5405C221.531 84.9916 224.434 87.4079 232.345 87.3963H309.308C312.29 87.3963 315.655 89.6508 316.837 92.4487L329.598 122.936C330.769 125.734 329.295 128 326.312 128H247.436C242.744 127.699 238.388 126.451 236.374 121.641L220 82.5405ZM286.182 19.4732L299.09 50.3421C300.26 53.1515 299.529 57.198 297.447 59.3946L278.732 79.523H236.183C229.442 79.604 225.447 76.9795 231.175 70.5861L280.308 18.3749C282.378 16.1782 285.012 16.6638 286.182 19.4732Z"
          fill="#00FFC1"
        />
      )}

      <defs>
        <filter
          id="filter0_f_403_206"
          x="-399.999"
          y="-371.86"
          width="1063.64"
          height="1152.67"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="200" result="effect1_foregroundBlur_403_206" />
        </filter>
        <linearGradient
          id="paint0_linear_403_206"
          x1="224.747"
          y1="129.192"
          x2="363.38"
          y2="77.9683"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#00FFFF" />
          <stop offset="1" stopColor="#28373F" />
        </linearGradient>
        <linearGradient id="linear_primary" gradientUnits="userSpaceOnUse">
          <stop offset="5%" stopColor="#00FFFF" />
          <stop offset="25%" stopColor="#60DDBF" />
        </linearGradient>
        <linearGradient id="linear_error" gradientUnits="userSpaceOnUse">
          <stop offset="5%" stopColor="#FF7CB2" />
          <stop offset="25%" stopColor="#E8488A" />
        </linearGradient>
      </defs>
      <text
        x={PADDING_X}
        y={PADDING_Y + 16}
        fill={textColor}
        fontSize={18}
        height={18}
        fontWeight={500}
        letterSpacing={0.5}
      >
        <tspan fill={textColor}>{optionText}&nbsp;</tspan>
        <tspan fill={secondaryTextColor}>·&nbsp;{expiryText}</tspan>
      </text>
      <text
        x={PADDING_X}
        y={PADDING_Y + 18 * 2 + 8}
        fill={position.isLong ? primaryTextColor : errorTextColor}
        fontSize={18}
        height={18}
        fontWeight={500}
        letterSpacing={0.5}
      >
        {positionText}&nbsp;
        {status ? <tspan fill={secondaryTextColor}>·&nbsp;{status}</tspan> : null}
      </text>
      <text
        x={PADDING_X}
        y={PADDING_Y + 105}
        fill={pnl >= 0 ? 'url(#linear_primary)' : 'url(#linear_error)'}
        fontSize={36}
        letterSpacing={0.5}
        fontWeight={600}
      >
        {formatUSD(pnl, { showSign: true })}
      </text>
      <svg x={PADDING_X} y={PADDING_Y + 135}>
        <PayoffChart
          tradeOrPosition={position}
          width={payoffChartWidth}
          height={155}
          color={pnl >= 0 ? 'primary' : 'error'}
          tooltipFontSize={15}
          useGradientLineColor
          compact
        />
      </svg>
    </svg>
  )
}
