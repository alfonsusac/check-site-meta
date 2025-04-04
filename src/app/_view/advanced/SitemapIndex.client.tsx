import { useSearchedEntries, useSortedEntries, usePagination } from "@/app/lib/Table"
import type { GetSitemapActionResponse } from "./Sitemap.action"
import { ListSearchInputField, SitemapFileCard, ListPaginationMenu } from "./Sitemap.client"

export function SitemapIndexList(props: {
  id: string,
  indexes:
  NonNullable<
    NonNullable<
      GetSitemapActionResponse
    >['validated']['res']['sitemaps']
  >,
  depth?: number,
  topOffset?: number,
  lastModified?: string
}) {
  const { indexes } = props
  const {
    search,
    searchedEntries,
    setSearch,
  } = useSearchedEntries(indexes)

  const {
    sorts,
    sortedEntries,
  } = useSortedEntries({ loc: 'string', lastmod: 'string' }, searchedEntries)

  const LIMIT = 10
  const {
    paginatedEntries,
    nextPage,
    prevPage,
    totalPages,
    page,
    hasNextPage,
    hasPrevPage,
  } = usePagination(LIMIT, sortedEntries)

  return (
    <>
      {sortedEntries.length > 0
        && <ListSearchInputField search={search} setSearch={setSearch} />
      }
      <div className="px-2 flex flex-col -mt-2">
        {paginatedEntries
          .map((sitemaps, i) => {
            return (
              <SitemapFileCard
                id={props.id + "_" + i + "_" + page}
                key={sitemaps.loc + "_" + i + "_" + page}
                fullUrl={sitemaps.loc}
                title={sitemaps.loc}
                lastModified={sitemaps.lastmod}
                defaultClosed
                depth={(props.depth ?? 0) + 1}
                topOffset={(props.lastModified ? 12 : 8.5)}
              />
            )
          })}
        <ListPaginationMenu
          entriesCount={sortedEntries.length}
          LIMIT={LIMIT}
          page={page}
          totalPages={totalPages}
          nextPage={nextPage}
          prevPage={prevPage}
          hasNextPage={hasNextPage}
          hasPrevPage={hasPrevPage}
        />
      </div>
    </>
  )
}







