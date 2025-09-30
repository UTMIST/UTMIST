import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200 ease-in-out focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "py-2 px-4 text-white rounded-[25px] font-medium hover:opacity-90",
        destructive:
          "py-2 px-4 bg-transparent text-red-600 border-2 border-red-600 rounded-full font-medium hover:bg-red-600 hover:text-white",
        outline:
          "py-2 px-4 bg-transparent text-[var(--gray4)] border-2 border-[var(--gray3)] rounded-full font-medium hover:bg-[var(--gray3)] hover:text-[var(--gray1)]",
        secondary:
          "py-2 px-6 bg-transparent text-[#6b66e3] border-2 border-[#6b66e3] rounded-full font-medium hover:bg-[#6b66e3] hover:text-white",
        ghost: "py-2 px-4 bg-transparent text-[var(--gray1)] rounded-[25px] font-medium hover:bg-[var(--gray3)] hover:text-[var(--gray4)]",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, style, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    const defaultStyle = variant === "default" || !variant ?
      { background: "var(--gradient-b2)", ...style } : style

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        style={defaultStyle}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
