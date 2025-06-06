import { cn } from "lazy-cn";
import type { ComponentProps } from "react";

export function CardHeader(props: ComponentProps<"div">) {
  return (
    <div {...props} className={cn("meta-info-field-key py-1 pb-2 font-semibold", props.className)} />
  )
}

export function CardHeaderTitle(props: ComponentProps<"div">) {
  return (
    <div {...props} className={cn("", props.className)} />
  )
}

export function CardHeaderSubtitle(props: ComponentProps<"div">) {
  return (
    <div {...props} className={cn("text-sm font-medium text-foreground-body", props.className)} />
  )
}