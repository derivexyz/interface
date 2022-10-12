import { Theme } from 'theme-ui'

const lightColors = {
  // background
  background: '#F7F3F9',
  bgGradient: 'linear-gradient(270deg, #EBFBF8 0%, #F7F3F9 100%)',
  hover: '#E8E8E880', // 50%
  active: '#E8E8E8CC', // 80%
  cardBg: '#FEFEFE73', // 45%
  cardElevatedBg: '#FEFEFE',
  cardNestedBg: '#E8E8E8CC', // 80%
  cardNestedHover: '#CFCECE80',

  // default button
  buttonBg: '#E8E8E899', // 60%
  buttonHover: '#E8E8E8CC', // 80%
  buttonActive: '#E8E8E8',
  buttonDisabled: '#B5BECA88',

  // primary button
  primaryButtonBg: '#56C3A9E6', // 90%
  primaryButtonHover: '#56C3A9', // 100%
  primaryButtonActive: '#52b9a1',

  // warning button
  warningButtonBg: '#F7931A',
  warningButtonHover: '#de8417',
  warningButtonActive: '#c87715',

  // error button
  errorButtonBg: '#FC4D95',
  errorButtonHover: '#e34586',
  errorButtonActive: '#cc3e79',

  // dark button
  elevatedButtonBg: '#E8E8E8',
  elevatedButtonHover: '#DCDCDC',
  elevatedButtonActive: '#D1D1D1',

  // toggle button
  toggleButtonBg: '#E8E8E899', // #E8E8E8 50%
  toggleButtonActive: '#FEFEFE', // #FEFEFE

  // tokens + alerts
  defaultTokenBg: '#E8E8E899',
  primaryTokenBg: '#57B29C33',
  errorTokenBg: '#FC4D9533',
  warningTokenBg: '#F7931A33',

  // toggle
  toggleTrackBg: '#E8E8E899',
  toggleCheckedTrackBg: '#3CAA8F',
  toggleThumbBg: '#6B7D94',
  toggleCheckedThumbBg: '#FFFFFF',

  // charts
  primaryLine: '#3CAA8F',
  primaryArea: '#57B29C33',
  errorLine: '#FC4D95',
  errorArea: '#FC4D9533',
  axis: '#C4CED7',
  crosshair: '#6B7D94',

  // spinner
  lightSpinner: '#a2a2a2',
  lightSpinnerBg: '#a2a2a233',
  primarySpinner: '#3CAA8F',
  primarySpinnerBg: '#3CAA8F33',
  errorSpinner: '#FC4D95',
  errorSpinnerBg: '#FC4D9533',
  warningSpinner: '#de8417',
  warningSpinnerBg: '#de841733',

  // scroll
  scrollBg: '#a2a2a233',

  // text
  text: '#052822',
  secondaryText: '#6B7D94',
  disabledText: '#95A4B5',
  invertedText: '#FFFFFF',
  primaryText: '#3CAA8F',
  errorText: '#FC4D95',
  warningText: '#de8417',

  // link
  link: '#5FC2AA',
  linkHover: '#72E1C6',

  // input
  inputBg: '#E8E8E899',
  inputHoverBg: '#E8E8E880',
  inputSuccess: '#57B29C',
  inputError: '#D86969',

  // modal
  modalBg: '#FEFEFE',
  modalOverlayBg: 'rgba(15, 15, 15, 0.65)',

  // trade sharing
  tradeShareBg: '#FFFFFF',
  tradeShareHoverBg: '#FFFFFFE6',

  // shimmer
  shimmerBg: '#e8e8e8',
  shimmerBgNested: '#D1CBCB',

  // shadows
  elevatedShadowBg: 'rgba(0, 0, 0, 0.1)',
}

const darkColors = {
  // backgrounds
  background: '#1A212B',
  hover: '#3A445033', // 20%
  active: '#3A445066', // 40%
  cardBg: '#25303BBF', // 75%
  cardElevatedBg: '#1B252D',
  cardNestedBg: '#36404C',
  cardNestedHover: '#3e4a56',

  // primary button
  primaryButtonBg: '#57B29C',
  primaryButtonHover: '#5BBCA5',
  primaryButtonActive: '#6bc3ae',

  // error button
  errorButtonBg: '#FC4D95',
  errorButtonHover: '#e34586',
  errorButtonActive: '#c73c75',

  // warning button
  warningButtonBg: '#F7931A',
  warningButtonHover: '#de8417',
  warningButtonActive: '#c27414',

  // default button
  buttonBg: '#3A445099', // 60%
  buttonHover: '#3A424BCC', // 80%
  buttonActive: '#3A424B', // 100%
  buttonDisabled: '#2e3640CC',

  // dark button
  elevatedButtonBg: '#1B252D',
  elevatedButtonHover: '#233039',
  elevatedButtonActive: '#2B3A47',

  // toggle button
  toggleButtonBg: '#3A445099', // #3A4450 60%
  toggleButtonActive: '#151F2699', // #151F26 60%

  // tokens + alerts
  defaultTokenBg: '#3A445099',
  primaryTokenBg: '#57B29C26',
  warningTokenBg: '#F7931A26',
  errorTokenBg: '#FC4D9526',

  // toggle
  toggleTrackBg: '#3A445099',
  toggleCheckedTrackBg: '#69D8BD',
  toggleThumbBg: '#95A4B5',
  toggleCheckedThumbBg: '#FFFFFF',

  // charts
  primaryLine: '#69D8BD',
  primaryArea: '#57B29C26',
  errorLine: '#FC4D95',
  errorArea: '#FC4D9526',
  axis: '#95A4B580',
  crosshair: '#95A4B5',

  // spinner
  lightSpinner: '#3A445099',
  lightSpinnerBg: '#3A445033',
  primarySpinner: '#69D8BD',
  primarySpinnerBg: '#69D8BD33',
  errorSpinner: '#FC4D95',
  errorSpinnerBg: '#FC4D9533',
  warningSpinner: '#de8417',
  warningSpinnerBg: '#de841733',

  // scroll
  scrollBg: '#3A445033',

  // text
  text: '#FFFFFF',
  secondaryText: '#95A4B5',
  disabledText: '#6B7D94',
  invertedText: '#000000',
  primaryText: '#69D8BD',
  errorText: '#FC4D95',
  warningText: '#de8417',

  // link
  link: '#69D8BD',
  linkHover: '#a0eedb',

  // input
  inputBg: '#3A445099',
  inputHoverBg: '#3A4450BF',
  inputSuccess: '#57B29C',
  inputError: '#D86969',

  // modal
  modalBg: '#27303A',
  modalOverlayBg: 'rgba(0, 0, 0, 0.4)',

  // trade sharing
  tradeShareBg: '#232B36',
  tradeShareHoverBg: '#05080AE6',

  // shimmer
  shimmerBg: '#3a424b',
  shimmerBgNested: '#4a5767',

  // shadows
  elevatedShadowBg: 'rgba(0, 0, 0, 0.1)',
}

const theme = {
  fonts: {
    body: "'Inter var', sans-serif",
    heading: "'Sohne', sans-serif",
    monospace: 'Menlo, monospace',
  },
  fontSizes: ['12px', '14px', '15px', '18px', '22px', '28px', '34px', '42px', '60px', '72px'],
  lineHeights: {
    small: '20px', //+8
    secondary: '21px', //+8
    body: '23px', //+8
    bodyLarge: '26px', //+8
    heading: '34px', //+12
    heading2: '24px',
    title: '36px', //+16
    largeTitle: '50px', //+16
    xlTitle: '58px', //+16
    heroHeading: '76px', //+16
    heroTitle: '88px', //+16
  },
  fontWeights: {
    light: 300,
    body: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    strong: 800,
    black: 900,
  },
  letterSpacings: {
    heroTitle: '0px',
    heroHeading: '0px',
    xlTitle: '0px',
    largeTitle: '0px',
    title: '0px',
    heading: '0px',
    bodyLarge: '0px',
    body: '0px',
    secondary: '0px',
    small: '0px',
  },
  space: [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64],
  breakpoints: ['860px', '2000px'],
  radii: {
    token: '3px',
    text: '4px',
    alert: 18,
    list: 18,
    card: 28,
    circle: 99999,
  },
  text: {
    heroTitle: {
      fontFamily: 'heading',
      fontWeight: 'bold',
      lineHeight: 'heroTitle',
      letterSpacing: 'heroTitle',
      fontSize: 9,
    },
    heroHeading: {
      fontFamily: 'heading',
      fontWeight: 'bold',
      lineHeight: 'heroHeading',
      letterSpacing: 'heroHeading',
      fontSize: 8,
    },
    xlTitle: {
      fontFamily: 'heading',
      fontWeight: 'bold',
      lineHeight: 'xlTitle',
      letterSpacing: 'xlTitle',
      fontSize: 7,
    },
    largeTitle: {
      fontFamily: 'heading',
      fontWeight: 'medium',
      lineHeight: 'largeTitle',
      letterSpacing: 'largeTitle',
      fontSize: 6,
    },
    title: {
      fontFamily: 'heading',
      fontWeight: 'medium',
      lineHeight: 'title',
      letterSpacing: 'title',
      fontSize: 5,
    },
    heading: {
      fontFamily: 'heading',
      fontWeight: 'medium',
      lineHeight: 'heading',
      letterSpacing: 'heading',
      fontSize: 4,
    },
    heading2: {
      fontFamily: 'heading',
      fontWeight: 'medium',
      lineHeight: 'heading2',
      letterSpacing: 'heading',
      fontSize: 3,
    },
    bodyLarge: {
      fontFamily: 'body',
      fontWeight: 'medium',
      lineHeight: 'bodyLarge',
      fontSize: 3,
      letterSpacing: 'bodyLarge',
    },
    body: {
      fontFamily: 'body',
      fontWeight: 'body',
      lineHeight: 'body',
      fontSize: 2,
      letterSpacing: 'body',
    },
    bodyMedium: {
      fontFamily: 'body',
      fontWeight: 'medium',
      lineHeight: 'body',
      fontSize: 2,
      letterSpacing: 'body',
    },
    secondary: {
      fontFamily: 'body',
      fontWeight: 'body',
      lineHeight: 'secondary',
      fontSize: 1,
      letterSpacing: 'secondary',
    },
    secondaryMedium: {
      fontFamily: 'body',
      fontWeight: 'medium',
      lineHeight: 'secondary',
      fontSize: 1,
      letterSpacing: 'secondary',
    },
    small: {
      fontFamily: 'body',
      fontWeight: 'body',
      lineHeight: 'small',
      fontSize: 0,
      letterSpacing: 'small',
    },
    smallMedium: {
      fontFamily: 'body',
      fontWeight: 'medium',
      lineHeight: 'small',
      fontSize: 0,
      letterSpacing: 'small',
    },
  },
  variants: {
    card: {
      borderRadius: [0, 'card'],
      overflow: 'hidden',
      bg: 'cardBg',
    },
    cardShadowBg: {
      borderRadius: [0, 'card'],
      overflow: 'hidden',
      boxShadow: (theme: Theme) => `0px -4px 72px -16px ${theme.colors ? theme.colors['elevatedShadowBg'] : ''}`,
      bg: 'cardBg',
    },
    cardElevated: {
      borderRadius: 'card',
      overflow: 'hidden',
      boxShadow: (theme: Theme) => `0px 0px 40px ${theme.colors ? theme.colors['elevatedShadowBg'] : ''}`,
      bg: 'cardElevatedBg',
    },
    cardNested: {
      borderRadius: 'card',
      overflow: 'hidden',
      bg: 'cardNestedBg',
    },
    cardModal: {
      borderRadius: [0, 'card'],
      overflow: 'hidden',
      boxShadow: (theme: Theme) => `0px 0px 40px ${theme.colors ? theme.colors['elevatedShadowBg'] : ''}`,
      bg: 'modalBg',
    },
    cardSeparator: {
      bg: 'background',
    },
    tableRow: {
      borderSpacing: 0,
      ':hover': {
        bg: 'hover',
      },
    },
    list: {
      bg: 'transparent',
      paddingInlineStart: 0,
      marginBlockStart: 0,
      marginBlockEnd: 0,
      marginInlineStart: 0,
      marginInlineEnd: 0,
      overflow: 'hidden',
      listStyleType: 'none',
      p: 0,
    },
    listItem: {
      color: 'text',
      textDecoration: 'none',
      textAlign: 'left',
      '&:not(.disabled):hover': {
        bg: 'hover',
      },
      '&:not(.disabled):active': {
        bg: 'active',
      },
      '&:(.disabled)': {
        cursor: 'not-allowed',
      },
    },
    inputContainer: {
      fontFamily: 'body',
      bg: 'inputBg',
      borderRadius: '18px',
      border: '1px solid',
      borderColor: 'inputBg',
      minHeight: '35px',
      ':hover': {
        bg: 'inputHoverBg',
      },
    },
    toast: {
      cursor: 'pointer',
    },
    toastDefault: {
      variant: 'toast',
      bg: 'modalBg',
      color: 'text',
    },
    toastError: {
      variant: 'toast',
      bg: 'errorButtonBg',
      color: 'white',
    },
    toastSuccess: {
      variant: 'toast',
      bg: 'primaryButtonBg',
      color: 'white',
    },
    toastWarning: {
      variant: 'toast',
      bg: 'warningButtonBg',
      color: 'white',
    },
    token: {
      fontSize: 0,
      fontWeight: 'semibold',
      borderRadius: 'token',
      textTransform: 'uppercase',
      letterSpacing: '2%',
      px: 2,
      lineHeight: '24px',
      height: '24px',
    },
    tokenDefault: {
      variant: 'variants.token',
      bg: 'defaultTokenBg',
      color: 'secondaryText',
    },
    tokenError: {
      variant: 'variants.token',
      bg: 'errorTokenBg',
      color: 'errorText',
    },
    tokenPrimary: {
      variant: 'variants.token',
      bg: 'primaryTokenBg',
      color: 'primaryText',
    },
    tokenWarning: {
      variant: 'variants.token',
      bg: 'warningTokenBg',
      color: 'warningText',
    },
    alert: {
      borderRadius: 'alert',
      py: 3,
      px: 4,
    },
    alertInfo: {
      variant: 'variants.alert',
      bg: 'cardBg',
      color: 'secondaryText',
    },
    alertError: {
      variant: 'variants.alert',
      bg: 'errorTokenBg',
      color: 'errorText',
    },
    alertPrimary: {
      variant: 'variants.alert',
      bg: 'primaryTokenBg',
      color: 'primaryText',
    },
    alertWarning: {
      variant: 'variants.alert',
      bg: 'warningTokenBg',
      color: 'warningText',
    },
    link: {
      textDecoration: 'none',
      transition: 'color 0.1s ease-out',
    },
    primaryLink: {
      variant: 'variants.link',
      color: 'link',
      ':hover': {
        color: 'linkHover',
      },
    },
    secondaryLink: {
      variant: 'variants.link',
      color: 'secondaryText',
      ':hover': {
        color: 'text',
      },
    },
  },
  buttons: {
    base: {
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'buttonBg',
      cursor: 'pointer',
      borderRadius: 'circle',
      ':focus': {
        outlineWidth: '0px',
      },
    },
    disabled: {
      variant: 'buttons.base',
      borderColor: 'transparent',
      color: 'disabledText',
      cursor: 'not-allowed',
      bg: 'buttonDisabled',
      '&:not(.disabled):hover': {
        bg: 'buttonDisabled',
        borderColor: 'transparent',
      },
    },
    primary: {
      variant: 'buttons.base',
      borderColor: 'primaryButtonBg',
      bg: 'primaryButtonBg',
      color: 'white',
      '&:not(.disabled):hover': {
        borderColor: 'primaryButtonHover',
        bg: 'primaryButtonHover',
      },
      '&:not(.disabled):active': {
        bg: 'primaryButtonActive',
        borderColor: 'primaryButtonActive',
      },
    },
    primaryTransparent: {
      variant: 'buttons.base',
      bg: 'transparent',
      color: 'primaryButtonBg',
      borderColor: 'transparent',
      '&:not(.disabled):hover': {
        bg: 'buttonBg',
        borderColor: 'transparent',
      },
      '&:not(.disabled):active': {
        bg: 'buttonHover',
        borderColor: 'transparent',
      },
    },
    primaryOutline: {
      variant: 'buttons.base',
      bg: 'transparent',
      color: 'primaryButtonBg',
      borderColor: 'primaryButtonBg',
      '&:not(.disabled):hover': {
        bg: 'buttonBg',
        borderColor: 'primaryButtonHover',
      },
      '&:not(.disabled):active': {
        bg: 'buttonHover',
        borderColor: 'primaryButtonActive',
      },
    },
    error: {
      variant: 'buttons.base',
      borderColor: 'errorButtonBg',
      bg: 'errorButtonBg',
      color: 'white',
      '&:not(.disabled):hover': {
        borderColor: 'errorButtonHover',
        bg: 'errorButtonHover',
      },
      '&:not(.disabled):active': {
        bg: 'errorButtonActive',
        borderColor: 'errorButtonActive',
      },
    },
    errorTransparent: {
      variant: 'buttons.base',
      bg: 'transparent',
      color: 'errorButtonBg',
      borderColor: 'transparent',
      '&:not(.disabled):hover': {
        bg: 'buttonBg',
        borderColor: 'transparent',
      },
      '&:not(.disabled):active': {
        bg: 'buttonHover',
        borderColor: 'transparent',
      },
    },
    errorOutline: {
      variant: 'buttons.base',
      bg: 'transparent',
      color: 'errorButtonBg',
      borderColor: 'errorButtonBg',
      '&:not(.disabled):hover': {
        bg: 'buttonBg',
        borderColor: 'errorButtonHover',
      },
      '&:not(.disabled):active': {
        bg: 'errorHover',
        borderColor: 'errorButtonActive',
      },
    },
    warning: {
      variant: 'buttons.base',
      borderColor: 'warningButtonBg',
      bg: 'warningButtonBg',
      color: 'white',
      '&:not(.disabled):hover': {
        borderColor: 'warningButtonHover',
        bg: 'warningButtonHover',
      },
      '&:not(.disabled):active': {
        bg: 'warningButtonActive',
        borderColor: 'warningButtonActive',
      },
    },
    warningTransparent: {
      variant: 'buttons.base',
      bg: 'transparent',
      color: 'warningButtonBg',
      borderColor: 'transparent',
      '&:not(.disabled):hover': {
        bg: 'buttonBg',
        borderColor: 'transparent',
      },
      '&:not(.disabled):active': {
        bg: 'buttonHover',
        borderColor: 'transparent',
      },
    },
    warningOutline: {
      variant: 'buttons.base',
      bg: 'transparent',
      color: 'warningButtonBg',
      borderColor: 'warningButtonBg',
      '&:not(.disabled):hover': {
        bg: 'buttonBg',
        borderColor: 'warningButtonHover',
      },
      '&:not(.disabled):active': {
        bg: 'warningHover',
        borderColor: 'warningButtonActive',
      },
    },
    default: {
      variant: 'buttons.base',
      borderColor: 'transparent',
      bg: 'buttonBg',
      color: 'text',
      '&:not(.disabled):hover': {
        bg: 'buttonHover',
        borderColor: 'buttonHover',
      },
      '&:not(.disabled):active': {
        bg: 'buttonActive',
        borderColor: 'buttonActive',
      },
    },
    defaultOutline: {
      variant: 'buttons.base',
      borderColor: 'buttonHover',
      bg: 'transparent',
      color: 'text',
      '&:not(.disabled):hover': {
        bg: 'hover',
        borderColor: 'hover',
      },
      '&:not(.disabled):active': {
        bg: 'active',
        borderColor: 'active',
      },
    },
    defaultTransparent: {
      variant: 'buttons.base',
      borderColor: 'transparent',
      bg: 'transparent',
      color: 'text',
      '&:not(.disabled):hover': {
        bg: 'buttonHover',
        borderColor: 'transparent',
      },
      '&:not(.disabled):active': {
        bg: 'active',
        borderColor: 'transparent',
      },
    },
    light: {
      variant: 'buttons.default',
      color: 'secondaryText',
      borderColor: 'transparent',
      '&:not(.disabled):hover': {
        color: 'text',
      },
      '&:not(.disabled):active': {
        color: 'text',
      },
    },
    lightOutline: {
      variant: 'buttons.defaultOutline',
      color: 'secondaryText',
      borderColor: 'secondaryText',
      '&:not(.disabled):hover': {
        color: 'text',
        borderColor: 'secondaryText',
      },
    },
    lightTransparent: {
      variant: 'buttons.defaultTransparent',
      color: 'secondaryText',
      '&:not(.disabled):hover': {
        color: 'text',
      },
    },
    white: {
      variant: 'buttons.base',
      bg: '#FFFFFFE6',
      color: lightColors.text,
      borderColor: '#FFFFFFE6',
      '&:not(.disabled):hover': {
        bg: lightColors.buttonHover,
        borderColor: 'transparent',
      },
      '&:not(.disabled):active': {
        bg: lightColors.buttonActive,
        borderColor: 'transparent',
      },
    },
    static: {
      variant: 'buttons.base',
      bg: 'buttonBg',
      color: 'secondaryText',
      borderColor: 'transparent',
      '&:not(.disabled):hover': {
        bg: 'buttonBg',
        color: 'text',
        borderColor: 'transparent',
      },
      '&:not(.disabled):active': {
        bg: 'buttonBg',
        color: 'text',
        borderColor: 'transparent',
      },
    },
    staticTransparent: {
      variant: 'buttons.base',
      bg: 'transparent',
      color: 'secondaryText',
      borderColor: 'transparent',
      '&:not(.disabled):hover': {
        bg: 'transparent',
        color: 'text',
        borderColor: 'transparent',
      },
      '&:not(.disabled):active': {
        bg: 'transparent',
        color: 'text',
        borderColor: 'transparent',
      },
    },
    elevated: {
      variant: 'buttons.base',
      bg: 'elevatedButtonBg',
      borderColor: 'transparent',
      color: 'text',
      boxShadow: (theme: Theme) => `0px 4px 24px ${theme.colors ? theme.colors['elevatedShadowBg'] : ''}`,
      '&:not(.disabled):hover': {
        bg: 'elevatedButtonHover',
        borderColor: 'transparent',
      },
      '&:not(.disabled):active': {
        bg: 'elevatedButtonActive',
        borderColor: 'transparent',
      },
    },
  },
  forms: {
    input: {
      variant: 'text.body',
      borderWidth: 1,
      borderColor: 'transparent',
      borderStyle: 'solid',
      borderRadius: 0,
      color: 'text',
      px: 0,
      py: 0,
      ':hover,:focus,.active': {
        outline: 0,
      },
      '::placeholder': {
        color: 'secondaryText',
        fontWeight: 'body',
      },
      '::-webkit-outer-spin-button,::-webkit-inner-spin-button': {
        WebkitAppearance: 'none',
        MozAppearance: 'none',
        margin: 0,
      },
    },
    slider: {
      color: 'secondaryText',
      ':focus': {
        color: 'primary',
      },
      bg: 'buttonBg',
    },
  },
  styles: {
    root: {
      variant: 'text.body',
    },
  },
  zIndex: {
    popover: 1000,
    modal: 100,
    chart: 2,
    desktopHeader: 1,
    topNavBar: 5,
    bottomNav: 101,
  },
}

export const getThemePreset = (isRoot: boolean, isLightMode: boolean = true): Theme => ({
  useColorSchemeMediaQuery: isRoot ? true : false,
  initialColorModeName: 'light',
  colors: {
    ...(isLightMode ? lightColors : darkColors),
    modes: isLightMode
      ? {
          dark: darkColors,
        }
      : { light: lightColors },
  },
  ...theme,
})

export const defaultPreset = getThemePreset(true)

export const darkTheme = {
  colors: darkColors,
  ...theme,
}

export const lightTheme = {
  colors: lightColors,
  ...theme,
}

export default defaultPreset
