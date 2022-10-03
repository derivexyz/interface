import { useResponsiveValue } from '@theme-ui/match-media'

function useThemeColor(arg: string | string[] | null = null): string {
  let arr: Array<string> = []
  if (arg != null) {
    arr = Array.isArray(arg) ? arg : [arg]
  }
  return useResponsiveValue((theme: any) => arr.map(color => theme?.colors[color])) || arg
}

export default useThemeColor
