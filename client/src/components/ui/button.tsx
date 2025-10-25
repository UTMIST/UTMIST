import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "text-white rounded-[10px] transition-[opacity,transform] duration-200 ease-in-out hover:opacity-90 hover:scale-105 cursor-pointer [background:linear-gradient(-99deg,#6B66E3_0%,#1E19B1_100%)]",
        destructive:
          "text-white rounded-[10px] transition-[opacity,transform] duration-200 ease-in-out hover:opacity-90 hover:scale-105 cursor-pointer [background:linear-gradient(180deg,#FF4444_0%,#CC0000_100%)]",
        outline:
          "border border-[#d9d9d9] bg-transparent text-[#1e19b1] rounded-[10px] transition-[opacity,transform,border-color] duration-200 ease-in-out hover:border-[#6B66E3] hover:scale-105 cursor-pointer",
        secondary:
          "text-white rounded-[10px] transition-[opacity,transform] duration-200 ease-in-out hover:opacity-90 hover:scale-105 cursor-pointer [background:linear-gradient(180deg,#5C5C5C_0%,#000000_100%)]",
        ghost: "text-[#1e19b1] rounded-[10px] transition-[opacity,transform,background] duration-200 ease-in-out hover:bg-[#f5f5f5] hover:scale-105 cursor-pointer",
        link: "text-[#1e19b1] underline-offset-4 hover:underline transition-opacity duration-200 hover:opacity-80",
      },
      size: {
        default: "px-[2.2rem] py-2 my-4",
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
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
