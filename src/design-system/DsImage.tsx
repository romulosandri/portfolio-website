type DsImageProps = {
  src: string
  alt: string
  width: number
  height: number
  className?: string
}

export function DsImage({ src, alt, width, height, className }: DsImageProps) {
  return (
    <span
      className={['inline-flex overflow-clip', className].filter(Boolean).join(' ')}
      style={{ width, height }}
    >
      <img
        alt={alt}
        className="block"
        height={height}
        src={src}
        style={{ width, height, maxWidth: 'none' }}
        width={width}
      />
    </span>
  )
}

type DsHoverImageProps = {
  defaultSrc: string
  hoverSrc: string
  alt: string
  width: number
  height: number
  className?: string
}

export function DsHoverImage({
  defaultSrc,
  hoverSrc,
  alt,
  width,
  height,
  className,
}: DsHoverImageProps) {
  return (
    <span
      className={['group relative inline-flex overflow-clip', className]
        .filter(Boolean)
        .join(' ')}
      style={{ width, height }}
    >
      <img
        alt={alt}
        className="block transition-opacity duration-150 group-hover:opacity-0 group-focus-within:opacity-0"
        height={height}
        src={defaultSrc}
        style={{ width, height, maxWidth: 'none' }}
        width={width}
      />
      <img
        alt=""
        className="absolute inset-0 block opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
        height={height}
        src={hoverSrc}
        style={{ width, height, maxWidth: 'none' }}
        width={width}
      />
    </span>
  )
}
