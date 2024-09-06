export function parseParamUrl(url: string) {
  const json: any = {}
  if (/\?/.test(url)) {
    const urlString = url.substring(url.indexOf('?') + 1)
    const urlArray = urlString.split('&')
    for (let i = 0; i < urlArray.length; i++) {
      const urlItem = urlArray[i]
      const item = urlItem!.split('=')
      json[item[0]!] = item[1]
    }
    return json
  }
  return {}
}

export function genArr(Arr: any[], id: string): any[] {
  const obj: any = {}
  const arrays = Arr.reduce((cur, item) => {
    // eslint-disable-next-line ts/no-unused-expressions
    obj[item[id]] ? '' : (obj[item[id]] = true && cur.push(item))
    return cur
  }, [])
  return arrays
}

export function RandomNumBoth(Min: number, Max: number) {
  const Range = Max - Min
  const Rand = Math.random()
  const num = Min + Math.round(Rand * Range) // 四舍五入
  return num
}
