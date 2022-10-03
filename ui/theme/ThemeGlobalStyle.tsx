import React from 'react'

import useIsMobile from '../hooks/useIsMobile'
import useThemeColor from '../hooks/useThemeColor'

// TODO: @dappbeast More graceful import into /app package
export default function ThemeGlobalStyle(): JSX.Element {
  const toggleTrackBg = useThemeColor('toggleTrackBg')
  const toggleCheckedTrackBg = useThemeColor('toggleCheckedTrackBg')
  const toggleThumbBg = useThemeColor('toggleThumbBg')
  const toggleCheckedThumbBg = useThemeColor('toggleCheckedThumbBg')
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
      body > div:first-child,
      div#__next,
      div#__next > div:first-child {
        height: 100%;
      }

      body {
        background: ${background};
        scrollbar-width: none;
        -ms-overflow-style: none;
        overflow: auto;
      }

      .Toastify__toast-container--top-right {
        top: ${isMobile ? 0 : 60}px !important;
        right: ${isMobile ? 0 : 4}px !important;
      }

      // https://styled-components.com/docs/faqs#how-can-i-override-styles-with-higher-specificity
      &&&.Toastify__toast-container {
        width: 420px !important;
        max-width: 100vw !important;
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

      .react-toggle {
        touch-action: pan-x;

        display: inline-block;
        position: relative;
        cursor: pointer;
        background-color: transparent;
        border: 0;
        padding: 0;

        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;

        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        -webkit-tap-highlight-color: transparent;
      }

      .react-toggle-screenreader-only {
        border: 0;
        clip: rect(0 0 0 0);
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        width: 1px;
      }

      .react-toggle--disabled {
        cursor: not-allowed;
        opacity: 0.5;
        -webkit-transition: opacity 0.25s;
        transition: opacity 0.25s;
      }

      .react-toggle-track {
        width: 36px;
        height: 18px;
        padding: 0;
        border-radius: 30px;
        background-color: ${toggleTrackBg};
        -webkit-transition: all 0.2s ease;
        -moz-transition: all 0.2s ease;
        transition: all 0.2s ease;
      }

      .react-toggle:hover:not(.react-toggle--disabled) .react-toggle-track {
        background-color: ${toggleTrackBg};
      }

      .react-toggle--checked .react-toggle-track {
        background-color: ${toggleCheckedTrackBg};
      }

      .react-toggle--checked:hover:not(.react-toggle--disabled) .react-toggle-track {
        background-color: ${toggleCheckedTrackBg};
      }

      .react-toggle-track-check {
        position: absolute;
        width: 14px;
        height: 10px;
        top: 0px;
        bottom: 0px;
        margin-top: auto;
        margin-bottom: auto;
        line-height: 0;
        left: 8px;
        opacity: 0;
        -webkit-transition: opacity 0.25s ease;
        -moz-transition: opacity 0.25s ease;
        transition: opacity 0.25s ease;
      }

      .react-toggle--checked .react-toggle-track-check {
        opacity: 1;
        -webkit-transition: opacity 0.25s ease;
        -moz-transition: opacity 0.25s ease;
        transition: opacity 0.25s ease;
      }

      .react-toggle-track-x {
        position: absolute;
        width: 10px;
        height: 10px;
        top: 0px;
        bottom: 0px;
        margin-top: auto;
        margin-bottom: auto;
        line-height: 0;
        right: 10px;
        opacity: 1;
        -webkit-transition: opacity 0.25s ease;
        -moz-transition: opacity 0.25s ease;
        transition: opacity 0.25s ease;
      }

      .react-toggle--checked .react-toggle-track-x {
        opacity: 0;
      }

      .react-toggle-thumb {
        transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1) 0ms;
        position: absolute;
        top: 1px;
        left: 1px;
        width: 16px;
        height: 16px;
        border: 1px solid ${toggleTrackBg};
        border-radius: 50%;
        background-color: ${toggleThumbBg};

        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;

        -webkit-transition: all 0.25s ease;
        -moz-transition: all 0.25s ease;
        transition: all 0.25s ease;
      }

      .react-toggle--checked .react-toggle-thumb {
        left: 18px;
        background-color: ${toggleCheckedThumbBg};
        border-color: ${toggleCheckedTrackBg};
      }

      .react-toggle--focus .react-toggle-thumb {
      }

      .react-toggle:active:not(.react-toggle--disabled) .react-toggle-thumb {
      }
    `}</style>
  )
}
