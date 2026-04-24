export default function imageLoader({
  src,
}: {
  src: string
  width: number
  quality?: number
}) {
  if (src.startsWith("http")) return src
  return `/ClaudeCookedHard${src}`
}
