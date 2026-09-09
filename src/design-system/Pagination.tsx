import { cx } from './cx'

function pageItems(page: number, pageCount: number): Array<number | 'ellipsis'> {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index + 1)
  }

  const start = Math.max(2, page - 1)
  const end = Math.min(pageCount - 1, page + 1)
  const items: Array<number | 'ellipsis'> = [1]
  if (start > 2) items.push('ellipsis')
  for (let n = start; n <= end; n += 1) items.push(n)
  if (end < pageCount - 1) items.push('ellipsis')
  items.push(pageCount)
  return items
}

type PaginationProps = {
  page: number
  pageCount: number
  onPageChange?: (page: number) => void
  forceHoverPage?: number
  label?: string
}

export function Pagination({
  page,
  pageCount,
  onPageChange,
  forceHoverPage,
  label = 'Pages',
}: PaginationProps) {
  if (pageCount <= 1) return null

  return (
    <nav aria-label={label} className="flex flex-wrap items-center justify-start gap-sm">
      {pageItems(page, pageCount).map((item, index) =>
        item === 'ellipsis' ? (
          <span
            className="inline-flex size-8 items-center justify-center text-body-small text-foreground-quaternary"
            key={`ellipsis-${index}`}
          >
            …
          </span>
        ) : (
          <button
            aria-current={item === page ? 'page' : undefined}
            aria-label={`Page ${item}`}
            className={cx(
              'inline-flex size-8 items-center justify-center border border-solid text-body-small',
              item === page
                ? 'border-stroke-secondary text-foreground-primary'
                : forceHoverPage === item
                  ? 'border-transparent bg-background-secondary text-foreground-primary'
                  : 'border-transparent text-foreground-secondary hover:bg-background-secondary hover:text-foreground-primary',
            )}
            key={item}
            onClick={() => onPageChange?.(item)}
            type="button"
          >
            {item}
          </button>
        ),
      )}
    </nav>
  )
}
