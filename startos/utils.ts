export const randomPassword = {
  charset: 'a-z,A-Z,1-9,!,@,$,%,&,*',
  len: 22,
}

export function jsonToDotenv<T extends Record<string, string | undefined>>(
  jsonObj: T,
): string {
  return Object.entries(jsonObj)
    .map(([key, value]) => `${key.toUpperCase()}=${value}`)
    .join('\n')
}

export function dotenvToJson<T extends Record<string, string | undefined>>(
  dotenvStr: string,
): T {
  return (
    dotenvStr
      .split('\n')
      // ignore empty lines and comments
      .filter((line) => line.trim() && !line.startsWith('#'))
      .reduce((acc, line) => {
        const [key, value] = line.split('=')
        if (key && value !== undefined) {
          ;(acc as Record<string, string>)[key.trim()] = value.trim()
        }
        return acc
      }, {} as T)
  )
}
