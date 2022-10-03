import React, { useState } from 'react'
import { useEffect } from 'react'
import { injectStyle } from 'react-toastify/dist/inject-style'

import Box from '../components/Box'
import emptyFunction from '../utils/emptyFunction'

type Props = {
  children: React.ReactNode
}

export const ModalContext = React.createContext<{
  openModalId: number
  setOpenModalId: React.Dispatch<number>
}>({ openModalId: 0, setOpenModalId: emptyFunction })

export default function ModalProvider({ children }: Props): JSX.Element {
  const [openModalId, setOpenModalId] = useState(0)

  useEffect(() => {
    injectStyle()
  }, [])

  useEffect(() => {
    if (openModalId > 0) {
      // Disable body scrolling
      document.body.style.overflow = 'hidden'
    } else {
      document.body.removeAttribute('style')
    }
    return () => {
      document.body.removeAttribute('style')
    }
  }, [openModalId])

  return (
    // TODO: @dappbeast fix theme typing
    <ModalContext.Provider value={{ setOpenModalId, openModalId }}>
      <>
        {children}
        <Box id="modal-container" />
      </>
    </ModalContext.Provider>
  )
}
