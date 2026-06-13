import { Button as ButtonPrimitive } from "@base-ui/react/button"
import Link from "next/link"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-[#0a2342] text-white shadow hover:bg-[#1a3a5c]",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-white/10 text-white border border-white/40 shadow-sm hover:bg-white hover:text-[#0a2342] backdrop-blur-sm transition-all",
        ghost:
          "hover:bg-accent hover:text-accent-foreground",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        link: "text-primary underline-offset-4 hover:underline",
        primary: "bg-gradient-to-r from-[#1a7a8a] to-[#22a0b4] text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300",
        teal: "bg-[#1a7a8a] text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 hover:bg-[#15606e] transition-all duration-300",
        whatsapp: "bg-[#25D366] text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 hover:bg-[#128C7E] transition-all duration-300",
      },
      size: {
        default:
          "h-11 px-6 py-2 text-[0.95rem] gap-2 rounded-lg",
        xs: "h-7 gap-1 rounded-md px-2 text-xs",
        sm: "h-9 gap-1.5 rounded-md px-4 text-sm",
        lg: "h-14 px-8 text-lg font-semibold gap-2.5 rounded-xl",
        icon: "h-11 w-11",
        "icon-xs": "h-7 w-7 rounded-md",
        "icon-sm": "h-9 w-9 rounded-md",
        "icon-lg": "h-14 w-14 rounded-xl",
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
  variant = "default",
  size = "default",
  href,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants> & { href?: string }) {
  if (href) {
    return (
      <Link 
        href={href} 
        className={cn(buttonVariants({ variant, size, className }))} 
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      />
    )
  }

  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
