import React from 'react'

import LayoutPageError from '../page_helpers/common/Layout/LayoutPageError'

export default function NotFoundPage(): JSX.Element {
  return <LayoutPageError error="Page not found" />
}
