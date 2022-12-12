// Taken and modified from dequal
const compare = (a: any | undefined, b: any | undefined) => {
  let ctor, len
  if (a === b) return true

  if (a && b && (ctor = a.constructor) === b.constructor) {
    if (ctor === Date) return a.getTime() === b.getTime()
    if (ctor === RegExp) return a.toString() === b.toString()

    if (ctor === Array) {
      if ((len = a.length) === b.length) {
        while (len-- && compare(a[len], b[len]));
      }
      return len === -1
    }

    if (!ctor || typeof a === 'object') {
      len = 0
      for (ctor in a) {
        if (Object.prototype.hasOwnProperty.call(a, ctor) && ++len && !Object.prototype.hasOwnProperty.call(b, ctor))
          return false
        // Shallow compare keys
        if (!(ctor in b) || a[ctor] !== b[ctor]) return false
      }

      return Object.keys(b).length === len
    }
  }

  return a !== a && b !== b
}

export default compare
