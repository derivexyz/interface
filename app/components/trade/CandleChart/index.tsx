import dynamic from 'next/dynamic'

const CandleChart = dynamic(() => import('@lyra/ui/components/CandleChart'), { suspense: true, ssr: false })

export default CandleChart
