function isObject(item: any) {
  return item && typeof item === 'object' && !Array.isArray(item)
}

export default function mergeDeep(_target: any, ...sources: any): any {
  if (!sources.length) return _target
  const source = sources.shift()
  let target = Object.assign({}, _target)
  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) target = Object.assign(target, { [key]: {} })
        target[key] = mergeDeep(target[key], source[key])
      } else {
        target = Object.assign(target, { [key]: source[key] })
      }
    }
  }

  return mergeDeep(target, ...sources)
}
