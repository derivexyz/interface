import dynamic from 'next/dynamic'

// TODO: Loading for suspended contents
const NoSSR = dynamic(() => import('./Node'), { ssr: false })
export default NoSSR
