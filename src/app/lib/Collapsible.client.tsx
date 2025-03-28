"use client"

import { cn } from "lazy-cn"
import { useState, type ComponentProps, type CSSProperties, type ReactNode, type SVGProps } from "react"
import { CollapsibleRow } from "./Collapsible"

export function useExpandableList(arr: unknown[]) {
  const [expandedList, setExpandedList] = useState([...Array.from(arr, () => true)])
  const isExpanded = (index: number) => expandedList[index]
  const toggaleExpanse = (index: number) => {
    setExpandedList((prev) => {
      const copy = [...prev]
      copy[index] = !copy[index]
      return copy
    })
  }
  const expandAll = () => {
    setExpandedList([...Array.from(arr, () => true)])
  }
  const collapseAll = () => {
    setExpandedList([...Array.from(arr, () => false)])
  }

  return {
    isExpanded,
    toggaleExpanse,
    expandAll,
    collapseAll,
  }

}

export function ExpandableAdvancedCard({ expanded, toggleExpanse, Label, Content, headerProps, zIndex, ...props }: ComponentProps<"div"> & {
  expanded: boolean,
  toggleExpanse?: () => void,
  Label: ReactNode,
  Content: ReactNode,
  headerProps?: ComponentProps<"div">,
  zIndex?: number,
}) {
  return (
    <div className="grow">
      <div {...props} className={cn(props.className)}>
        <div {...headerProps} className={cn("flex sticky top-(--header-offset)", headerProps?.className)}
          style={{ zIndex }}
        >
          <div className="bg-(--bg) grow pt-2 min-w-0">
            <div className="border-x border-t border-border bg-background-card rounded-t-md">
              {/* Button have py which will be overlapped by Bottom Rounded Piece */}
              <button className="flex items-start gap-2 py-2 pl-3 grow leading-none min-w-0 w-full text-nowrap overflow-clip **:overflow-hidden **:text-ellipsis"
                onClick={() => toggleExpanse?.()}
              >
                <MaterialSymbolsExpandMoreRounded className={cn("w-4 h-4 transition-all shrink-0",
                  expanded ? "rotate-180" : "rotate-0"
                )} />
                {Label}
              </button>
            </div>
          </div>
        </div>

        {/* Wrapper to pass background color to child */}
        <div className="border-x  border-border overflow-clip bg-background"
          style={{
            // "--bg": "var(--color-background-card)",
          }}
        >
          <CollapsibleRow data-opened={expanded}>
            {Content}
          </CollapsibleRow>
        </div>
      </div>

      {/* Bottom Rounded Piece | -mt-2 is required to overlap parent | relative zIndex is required to overlap top piece*/}
      <div className="relative bg-(--bg)" /** This is required to match background color that overlaps top piece */
        style={{ zIndex }}>
        <div className="h-2 grow rounded-b-md border-b border-x border-border -mt-2 transition-[background]"
          style={{
            background: expanded ? "var(--color-background)" : "var(--color-background-card)",
          }}
        />
      </div>
    </div>

  )
}

export function MaterialSymbolsExpandMoreRounded(props: SVGProps<SVGSVGElement>) {
  return (<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>{/* Icon from Material Symbols by Google - https://github.com/google/material-design-icons/blob/master/LICENSE */}<path fill="currentColor" d="M12 14.95q-.2 0-.375-.062t-.325-.213l-4.6-4.6q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l3.9 3.9l3.9-3.9q.275-.275.7-.275t.7.275t.275.7t-.275.7l-4.6 4.6q-.15.15-.325.213T12 14.95"></path></svg>)
}