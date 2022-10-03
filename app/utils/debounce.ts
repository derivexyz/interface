export default function debounce<T extends (...args: any) => any>(cb: T, wait = 20) {
  let h: NodeJS.Timeout | null = null
  const callable = (...args: any) => {
    if (h != null) clearTimeout(h)
    h = setTimeout(() => cb(...args), wait)
  }
  return <T>(<any>callable)
}
