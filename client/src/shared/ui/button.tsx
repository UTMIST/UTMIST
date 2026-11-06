import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/shared/lib"

const buttonVariants = cva(
  "ui-focus inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 motion-reduce:transition-none",
  {
    variants: {
      variant: {
        default:
          "text-white rounded-[10px] transition-[opacity,transform] duration-[var(--ui-transition-duration)] ease-[var(--ui-transition-ease)] hover:opacity-90 hover:scale-105 cursor-pointer [background:var(--button-gradient)]",
        destructive:
          "text-white rounded-[10px] transition-[opacity,transform] duration-[var(--ui-transition-duration)] ease-[var(--ui-transition-ease)] hover:opacity-90 hover:scale-105 cursor-pointer [background:var(--button-destructive-gradient)]",
        outline:
          "border border-border bg-transparent text-secondary rounded-[10px] transition-[opacity,transform,border-color,background-color] duration-[var(--ui-transition-duration)] ease-[var(--ui-transition-ease)] hover:border-secondary hover:scale-105 cursor-pointer",
        secondary:
          "text-white rounded-[10px] transition-[opacity,transform] duration-[var(--ui-transition-duration)] ease-[var(--ui-transition-ease)] hover:opacity-90 hover:scale-105 cursor-pointer [background:var(--button-secondary-gradient)]",
        ghost: "text-secondary rounded-[10px] transition-[opacity,transform,background] duration-[var(--ui-transition-duration)] ease-[var(--ui-transition-ease)] hover:bg-[var(--surface-hover)] hover:scale-105 cursor-pointer",
        link: "text-secondary underline-offset-4 hover:underline transition-opacity duration-[var(--ui-transition-duration)] hover:opacity-80",
      },
      size: {
        default: "px-[2.2rem] py-2 my-4",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
      iconSize: {
        sm: "[&_svg]:size-4",
        md: "[&_svg]:size-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      iconSize: "sm",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, iconSize, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, iconSize, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
