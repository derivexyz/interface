type KeyedObject = Record<string | number, any>

export default function getValue(
  object: KeyedObject,
  pathOrArray: string | (string | number | null | undefined)[]
): any {
  if (Array.isArray(pathOrArray)) {
    if (pathOrArray.find(v => v === null || v === undefined)) {
      return null
    } else {
      return (pathOrArray.filter(a => a != null) as (string | number)[]).reduce(
        (o: KeyedObject, k) => (o || {})[k],
        object
      )
    }
  } else {
    return pathOrArray
      .replace(/\[/g, '.')
      .replace(/\]/g, '')
      .split('.')
      .reduce((o: KeyedObject, k) => (o || {})[k], object)
  }
}
