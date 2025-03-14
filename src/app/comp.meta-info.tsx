import ErrorCard from "./module/error/ErrorCard";
import { MetaCard } from "./_view/MetaCard";
import { tab } from "./module/tab/tab-primitives";
import { Tabs } from "./module/tab/Tabs";
import { type MetadataMetadataItem, type ResoledMetadata } from "./lib/get-metadata-field-data";
import { ExternalIcon, MetadataItem, Separator } from "./_view/FieldData";
import { Suspense } from "react";
import { FaviconPreview, IconListPreviewMetadataItem } from "./_view/Favicon";
import { appFetch } from "./lib/fetch";
import { px } from "./lib/unit";
import { OpengraphMetadata } from "./_view/OpenGraph";

export async function MetaInfoPanel(
  props: { metadata: Promise<ResoledMetadata | null> }
) {
  try {
    const metadata = await props.metadata;
    if (!metadata) return null

    return (
      <Tabs
        id="info"
        tabProps={{ className: "tab self-start mb-4 fadeIn-0" }}
        tabIndicatorProps={{ className: "bg-white rounded-sm shadow-xs" }}
        tabs={[
          tab("General",
            <div>General</div>,
            <MetaCard>
              <SummaryMetadata m={metadata} />
            </MetaCard>
          ),
          tab("Open Graph",
            <div>Open Graph</div>,
            <MetaCard>
              <OpengraphMetadata m={metadata} />
            </MetaCard>
          ),
          tab("Twitter",
            <div>Twitter</div>,
            <MetaCard>
              <TwitterMetadata m={metadata} />
            </MetaCard>
          ),
          tab("Icons", <div>Icons</div>,
            <MetaCard>
              <IconMetadata data={metadata} />
            </MetaCard>
          ),
        ]} />
    );
  } catch (error) {
    console.log(error)
    return <ErrorCard error={error} />;
  }
}

function SummaryMetadata(
  props: { m: ResoledMetadata }
) {
  const d = props.m;
  return (
    <>
      <MetadataItem data={d.general.title} />
      <MetadataItem data={d.general.description} />
      <MetadataItem data={d.general.author} />

      <MetadataItem data={d.general.inferredFavicon}>
        <Suspense fallback="Loading...">
          <FaviconSummary data={d.general.favicons} baseUrl={d.general.rawUrl.value} />
        </Suspense>
      </MetadataItem>

      <Separator />
      <MetadataItem data={d.og.title} />
      <MetadataItem data={d.og.description} />
      <MetadataItem data={d.og.image} />
      <MetadataItem data={d.og.url} />
      <MetadataItem data={d.og.type} />
      <MetadataItem data={d.og.siteName} />
      <Separator />
      <MetadataItem data={d.twitter.title} />
      <MetadataItem data={d.twitter.description} />
      <MetadataItem data={d.twitter.card} />
      <MetadataItem data={d.twitter.image} />
      <Separator />
      <MetadataItem data={d.general.viewport} />
      <MetadataItem data={d.general.url} />
      <MetadataItem data={d.general.robots} />
      <MetadataItem data={d.general.applicationName} />
      <MetadataItem data={d.general.keywords} />
      <MetadataItem data={d.general.generator} />
      <MetadataItem data={d.general.license} />
      <Separator />
      <MetadataItem data={d.general.colorScheme} />
      <MetadataItem data={d.general.colorTheme}>
        <ColorThemes data={d.general.colorTheme} />
      </MetadataItem>
      <MetadataItem data={d.general.formatDetection} />
    </>
  )
}

async function FaviconSummary(
  props: { data: MetadataMetadataItem, baseUrl: string }
) {
  const favicons = props.data.values
  if (!favicons) return <span className="meta-mute">-</span>

  let favicon: {
    value: string,
    resolvedUrl: string,
    label: string
  } | null = null

  for (const f of favicons) {
    if (!f.resolvedUrl) continue
    const res = await appFetch(f.resolvedUrl)
    if (res.headers.get("content-type")?.includes("image")) {
      favicon = {
        value: f.value ?? "",
        resolvedUrl: f.resolvedUrl,
        label: f.label
      }
      break
    }
  }

  if (!favicon) return <span className="meta-mute">-</span>

  return (
    <div className="flex gap-2 items-start">
      <FaviconPreview
        containerProps={{ className: "shrink-0" }}
        src={favicon.resolvedUrl}
      />
      <div>
        <a className="link-underline block leading-snug" target="_blank" href={favicon.resolvedUrl}>
          {favicon.value} <ExternalIcon />
        </a> <span>{favicon.label}</span>
      </div>
    </div>
  )
}

function ColorThemes(
  props: { data: MetadataMetadataItem }
) {
  return (
    <>
      {props.data.values?.length === 0 ? <span className="meta-mute">-</span> : null}
      {props.data.values?.map((item, i) => {
        return (
          <div key={i} className="flex gap-1 items-start my-1">
            <div
              className="w-4 h-4 rounded-sm border border-slate-200 shrink-0"
              style={{
                background: item.value
              }}
            />
            <span className="text-xs">{item.value}</span>
            <span className="text-xs">{item.label}</span>
          </div>
        )
      })}
    </>
  )
}



function TwitterMetadata(
  props: { m: ResoledMetadata }
) {
  const d = props.m
  return (
    <>
      <MetadataItem data={d.twitter.title} />
      <MetadataItem data={d.twitter.description} />
      <MetadataItem data={d.twitter.card} />
      <MetadataItem data={d.twitter.image} />
      <MetadataItem data={d.twitter.imageAlt} />
      <Separator />
      <MetadataItem data={d.twitter.site} />
      <MetadataItem data={d.twitter.siteId} />
      <Separator />
      <MetadataItem data={d.twitter.creator} />
      <MetadataItem data={d.twitter.creatorId} />
      <Separator />
      <MetadataItem data={d.twitter.player} />
      <MetadataItem data={d.twitter.playerWidth} />
      <MetadataItem data={d.twitter.playerHeight} />
      <MetadataItem data={d.twitter.playerStream} />
      <Separator />
      <MetadataItem data={d.twitter.appCountry} />
      <Separator />
      <MetadataItem data={d.twitter.appNameIphone} />
      <MetadataItem data={d.twitter.appIdIphone} />
      <MetadataItem data={d.twitter.appUrlIphone} />
      <Separator />
      <MetadataItem data={d.twitter.appNameIpad} />
      <MetadataItem data={d.twitter.appIdIpad} />
      <MetadataItem data={d.twitter.appUrlIpad} />
      <Separator />
      <MetadataItem data={d.twitter.appNameGoogleplay} />
      <MetadataItem data={d.twitter.appIdGoogleplay} />
      <MetadataItem data={d.twitter.appUrlGoogleplay} />
    </>
  )
}

function IconMetadata(props: {
  data: ResoledMetadata
}) {

  return (
    <>
      <MetadataItem data={{ label: "icon", value: undefined }}
        contentProps={{ className: "col-span-2 col-span-2 row-start-[10] mt-2 grid grid-cols-1 gap-2" }}>
        {(async () => {
          if (!props.data.general.favicons.values.length) return <div className="opacity-40">-</div>

          const rawFavicons = props.data.general.favicons.values

          const favicons: {
            source: string,
            size: string,
            resolvedSize: number | null,
            value: string,
            resolvedUrl: string,
          }[] = []

          for (const f of rawFavicons) {
            if (!f.resolvedUrl) continue
            const res = await appFetch(f.resolvedUrl)

            if (res.headers.get("content-type")?.includes("image")) {
              const resolvedSize = f.labels[2] ? parseInt(f.labels[2]) : NaN
              favicons.push({
                source: f.labels[0] ?? "?",
                size: f.labels[2] ?? "size undefined",
                value: f.value ?? "value undefined (huh?)",
                resolvedSize: isNaN(resolvedSize) ? null : resolvedSize,
                resolvedUrl: f.resolvedUrl
              })
            }
          }

          return <>{favicons.map((item, i) => {
            const { source, size, value, resolvedUrl, resolvedSize } = item
            return <div key={i} className="flex gap-2 items-start flex-wrap">
              <FaviconPreview
                containerProps={{ className: "" }}
                imgProps1={{ style: { height: resolvedSize ? px(resolvedSize) : undefined, width: resolvedSize ? px(resolvedSize) : undefined } }}
                imgProps2={{ style: { height: resolvedSize ? px(resolvedSize) : undefined, width: resolvedSize ? px(resolvedSize) : undefined } }}
                src={resolvedUrl} />
              <div className="text-xs meta-info-field-value break-words min-w-40 basis-0 grow">
                &quot;{source}&quot;<br />
                {value.startsWith('data:') ? (
                  <div className="line-clamp-3">{value}...</div>
                ) : (
                  <div>{value}</div>
                )}
                {size ?? "size undefined"}<br />
              </div>
            </div>
          })}
          </>
        })()}
      </MetadataItem>
      <hr />
      <IconListPreviewMetadataItem data={props.data.icons.appleTouchIcons} />
      <hr />
      <IconListPreviewMetadataItem data={props.data.icons.appleTouchIconsPrecomposed} />
    </>
  )
}