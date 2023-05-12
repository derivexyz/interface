import React from 'react'

import useIsMobile from '../hooks/useIsMobile'
import useThemeColor from '../hooks/useThemeColor'

// TODO: @dappbeast More graceful import into /app package
export default function ThemeGlobalStyle(): JSX.Element {
  const scrollBg = useThemeColor('scrollBg')
  const background = useThemeColor('background')
  const isMobile = useIsMobile()
  return (
    <style>{`
      :root { font-family: 'Inter', sans-serif; }
      @supports (font-variation-settings: normal) {
        :root { font-family: 'Inter var', sans-serif; }
      }

      html,
      body,
      body,
      div#root,
      div#root > div:first-child {
        height: 100%;
      }

      div#root > div:first-child {
        display: flex;
        flex-direction: column;
      }

      body {
        background: ${background};
        scrollbar-width: none;
        -ms-overflow-style: none;
        overflow: auto;
      }

      .Toastify__toast-container--top-right {
        top: ${isMobile ? 12 : 72}px !important;
        right: ${isMobile ? 12 : 20}px !important;
        min-width: ${isMobile ? '100%' : '340px'} !important;
        max-width: ${isMobile ? '100vw' : '100vw'} !important;
        min-height: 42px !important;
      }
      .Toastify__toast {
        border-radius: 18px !important;
        padding: 0px !important;
        min-height: 42px !important;
      }
      .Toastify__toast-body {
        padding: 0px !important;
        margin: 0px !important;
      }
      .Toastify__progress-bar {
      }
      .Toastify__toast--default {
        background: transparent;
      }

      ::-webkit-scrollbar {
        width: 0px;
      }
      ::-webkit-scrollbar-track {
        -webkit-box-shadow: none;
      }
      ::-webkit-scrollbar-thumb {
        background: ${scrollBg};
        -webkit-box-shadow: none;
      }
      ::-webkit-scrollbar-thumb:window-inactive {
        background: none;
      }
    `}</style>
  )
}
