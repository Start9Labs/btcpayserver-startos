import { FileHelper, matches, T } from "@start9labs/start-sdk"

// @todo remove when FileHelper.env is fixed

type ToPath = string | { volumeId: T.VolumeId; subpath: string }
type Validator<T, U> = matches.Validator<T, U> | matches.Validator<unknown, U>

export function env<A extends {}, Transformed = Record<string, string>>(
  path: ToPath,
  shape: Validator<Transformed, A>,  
): FileHelper<A> {  
  return FileHelper.raw<A>(
    path,
    (inData) =>
      Object.entries(inData)
        .map(([k, v]) => `${k}=${v}`)
        .join("\n"),
    (inString) =>
      Object.fromEntries(
        inString
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => !line.startsWith("#") && line.includes("="))
          .map((line) => {
            const pos = line.indexOf("=")
            return [line.slice(0, pos), line.slice(pos + 1)]
          }),
      ),
    (data) => shape.unsafeCast(data as Transformed),
  )
}