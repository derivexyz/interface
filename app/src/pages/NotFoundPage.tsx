import React from 'react'

import PageError from '../page_helpers/common/Page/PageError'

export default function NotFoundPage(): JSX.Element {
  return <PageError error="Page not found" />
}
