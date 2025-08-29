import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:scale-[1.02] active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg hover:shadow-xl hover:from-primary/90 hover:to-primary/80 ring-1 ring-primary/20",
        destructive:
          "bg-gradient-to-r from-destructive to-destructive/90 text-white shadow-lg hover:shadow-xl hover:from-destructive/90 hover:to-destructive/80 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 ring-1 ring-destructive/20",
        outline:
          "border border-border/50 bg-background/50 backdrop-blur-sm shadow-md hover:bg-accent/80 hover:text-accent-foreground hover:border-border hover:shadow-lg dark:bg-input/20 dark:border-input/50 dark:hover:bg-input/40 ring-1 ring-border/10",
        secondary:
          "bg-gradient-to-r from-secondary to-secondary/90 text-secondary-foreground shadow-md hover:shadow-lg hover:from-secondary/90 hover:to-secondary/80 ring-1 ring-secondary/20",
        ghost:
          "hover:bg-accent/80 hover:text-accent-foreground hover:shadow-md dark:hover:bg-accent/40 backdrop-blur-sm",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary/80",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  type,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      // ✅ Default safe: "button" (no accidental form submits)
      type={type ?? "button"}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
