import { cache, Fragment, Suspense, type ComponentProps } from "react";
import { getMetadataValues, fetchRoot } from "./lib/get-metadata";
import { parseUrlFromQuery } from "./lib/parse-url";
import type { SearchParamsContext } from "./lib/next-types";
import { getResolvedMetadata } from "./lib/get-metadata-field-data";
import { MetaInfoPanel } from "./_view/MetaInfo";
import { cn } from "lazy-cn";
import { getVersion } from "./lib/version";
import { ThemeSwitcher } from "./theme-switch";
import { changelog } from "../../changelog"
import { HomeErrorCard } from "./module/error/ErrorCard";
import { getUserSettings } from "./lib/get-settings";
import { LinkPreviewPanel } from "./_view/LinkPreview";
import { InputForm } from "./_view/inputs/InputForm";
import { RecentSuggestions } from "./_view/inputs/InputSuggestions";
import { AdvancedPanel } from "./_view/advanced/AdvancedPanel";
import { AppError } from "./module/error/error-primitives";
import { isDev } from "./lib/env";
import { LocalContextProvider } from "./context";

// Structure:
// 
//  query
//   ↓
//  url
//   ↓
//  root
//   ↓
//  metadata    
//   ↓
//  resolved metadata  ← descriptions
//   ↓             ↓
//  fields       previews
// 


export default async function Home(context: SearchParamsContext) {

  const query = await context.searchParams;
  const hasURL = !!query.url
  const searchId = isDev ? query.url + '' : Math.random()

  const SummarySection = async () =>
    !!query.url
    && getPageData(query.url)
      .then(metadata => <MetaInfoPanel metadata={metadata} />)
      .catch(err => <HomeErrorCard error={err} />)

  const LinkPreviewSection = async () =>
    !!query.url
    && getPageData(query.url)
      .then(metadata => <LinkPreviewPanel metadata={metadata} />)
      .catch(() => null)

  const AdvancedSection = async () =>
    !!query.url
    && getPageData(query.url)
      .then(metadata => <AdvancedPanel metadata={metadata} />)
      .catch(() => null)

  return (
    <>
      <div className="min-h-screen">
        <main className={cn(
          "container-sm lg:container-2xl font-medium font-sans",
          "px-8 lg:px-12 xl:px-24 ",
          "pb-40",
          "lg:grid lg:grid-cols-2 gap-x-8",
          "items-start",
        )}>
          <div className="flex flex-col min-h-[80vh] py-12">
            <Header hidden={hasURL} />
            <InputForm
              query={query}
              settings={await getUserSettings()} />
            <RecentSuggestions hidden={hasURL} />
            <div className="flex flex-col gap-8 pt-8">
              <Suspense key={searchId + 'summary'} fallback={<Loading />}>
                <SummarySection />
              </Suspense>
            </div>
          </div>

          <div className="flex flex-col items-center gap-8 pt-15 pb-12">
            <Changelog hidden={hasURL} />
            <Suspense key={searchId + 'linkpreview'}>
              <LinkPreviewSection />
            </Suspense>
          </div>

          <div className="col-span-2 flex flex-col">
            <Suspense key={searchId + 'advanced'}>
              <LocalContextProvider key={searchId}>
                <AdvancedSection />
              </LocalContextProvider>
            </Suspense>
          </div>

        </main>
      </div>
      <Footer />
    </>
  );
}

// Data Getter -----------------------------

const getPageData = cache(async function getPageData(query: string | string[]) {
  try {
    // console.log("Getting Page Data..")
    // delay 1s
    // await new Promise(resolve => setTimeout(resolve, 1000))
    const url = parseUrlFromQuery(query)
    const { root, html } = await fetchRoot(url.toString())
    const metadata = getMetadataValues(root, url.toString())
    const resolved = getResolvedMetadata(metadata)
    return { resolved, html, root, url }
  } catch (error) {
    throw new AppError('getPageData', undefined, undefined, undefined, error)
  }
})
export type SiteMetadata = Awaited<ReturnType<typeof getPageData>>


// Components -----------------------------


function Header(props: {
  hidden: boolean
}) {
  return <header className="collapsible-row-grid-700 closed:collapse-row group" data-closed={props.hidden ? "" : undefined} style={{
    overflowAnchor: 'none',
  }}>
    <div className="min-h-0">
      <div className="mb-12 mt-20 text-center lg:text-start flex flex-col items-center lg:block g-closed:opacity-0 g-closed:translate-y-10 transition duration-700">
        <div className="text-5xl md:text-6xl lg:text-5xl xl:text-6xl  tracking-[-0.08em] font-mono header-fill font-bold">
          check-site-meta
        </div>
        <div className="text-foreground-muted max-w-100 mt-2 font-sans text-xl g-closed:opacity-0 g-closed:translate-y-10 transition duration-700">
          100% local site metadata checker
        </div>
      </div>
    </div>
  </header>
}

function Footer(props: ComponentProps<"footer">) {
  return (
    <footer {...props} className={cn("w-full min-h-[50vh] col-span-2 pb-40 pt-10 border-t border-border bg-background shadow-2xl", props.className)}>
      <div className="container-md lg:container-2xl px-8 lg:px-12 xl:px-24 text-foreground-body flex flex-wrap gap-y-8">
        <div className="flex flex-col grow font-mono">
          <div className="text-[1rem] font-semibold tracking-tight leading-none ">
            npx check-site-meta
          </div>
          <div className="text-xs">
            {getVersion()}
          </div>
          <div className="mt-10 flex flex-wrap gap-6">
            {[
              ['npm', 'https://www.npmjs.com/package/check-site-meta'],
              ['github', 'https://github.com/alfonsusac/check-site-meta'],
              ['twitter', 'https://x.com/alfonsusac/status/1899798175512412648'],
              ['discord', 'https://discord.gg/DCNgFtCm'],
            ].map(e => (
              <a key={e[0]} className="button transition underline" href={e[1]} target="_blank">{e[0]}</a>
            ))}
          </div>
          <div className="mt-4">
            Made by <a href="https://alfon.dev">alfonsusac</a> • ©{new Date().getFullYear()} alfonsusac. All rights reserved.
          </div>
        </div>
        <div className="shrink-0">
          <ThemeSwitcher />
        </div>
      </div>
    </footer>
  )
}

function Loading() {
  return (
    <div>
      <div className="fadeIn-200">Loading...</div>
      <div className="fadeIn-2000">This takes longer than expected...</div>
    </div>
  )
}


// Components -----------------------------


function Changelog(props: {
  hidden?: boolean
}) {
  return (
    <div className="w-full grid grid-rows-[1fr] closed:grid-rows-[0fr] overflow-hidden group transition-[grid-template-rows] duration-700" data-closed={props.hidden ? "" : undefined}>
      <div className="min-h-0 closed:opacity-0 transition-all duration-300 delay-100" data-closed={props.hidden ? "" : undefined}>
        <div className="pt-20 pb-4 text-foreground-muted-3 font-medium">changelog</div>
        <div className="grid grid-cols-[6rem_1fr] gap-y-4 text-foreground-muted text-base">
          {Object.entries(changelog).map(([version, changes]) => (
            <Fragment key={version}>
              <div className="text-foreground-muted-3">{version}</div>
              <ul className="">
                {changes.map((change, i) => (
                  <li key={i} className="text-foreground-muted-2/80 py-0.5 list-['-___']">{change}</li>
                ))}
              </ul>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}