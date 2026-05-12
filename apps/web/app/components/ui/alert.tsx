import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "~/components/lib/utils"

const alertVariants = cva(
  "group/alert relative w-full rounded-lg border px-4 py-3 text-sm shadow-sm transition-all has-[>svg]:pl-11 *:[svg]:absolute *:[svg]:left-4 *:[svg]:top-4 *:[svg]:text-current",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground bg-glossy",
        destructive:
          "border-red-600/50 bg-red-50 text-red-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0)_50%,rgba(0,0,0,0.05)_100%)] dark:bg-red-950 dark:text-red-50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "mb-1 font-semibold leading-none tracking-tight text-letterpress",
        className
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-sm opacity-90 [&_p]:leading-relaxed",
        className
      )}
      {...props}
    />
  )
}

function AlertAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-action"
      className={cn("absolute top-1.5 right-2", className)}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription, AlertAction }
