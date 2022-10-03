import React, { useEffect, useRef, useState } from 'react'

export default function useHover<T extends HTMLElement>(): [React.Ref<T>, boolean] {
  const [value, setValue] = useState(false)
  const ref = useRef<T>(null)
  const handleMouseOver = () => setValue(true)
  const handleMouseOut = () => setValue(false)
  useEffect(
    () => {
      const node = ref.current
      if (node != null) {
        node.addEventListener('mouseenter', handleMouseOver)
        node.addEventListener('mouseleave', handleMouseOut)
        return () => {
          node.removeEventListener('mouseenter', handleMouseOver)
          node.removeEventListener('mouseleave', handleMouseOut)
        }
      }
    },
    [ref.current] // Recall only if ref changes
  )
  return [ref, value]
}
