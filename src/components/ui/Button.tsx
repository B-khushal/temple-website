import * as React from "react"
import { cn } from "../../lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: 'bg-[#9B2226] text-white hover:bg-[#7a181b] shadow-lg border-transparent',
      secondary: 'bg-[#F7F1E5] text-[#6B4E31] hover:bg-[#EEDCC1] border border-[#EEDCC1]',
      outline: 'bg-transparent border border-[#C09B6A] text-[#3E2723] hover:bg-[#F7F1E5]',
      ghost: 'hover:bg-[#F7F1E5] text-[#3E2723]',
      danger: 'bg-[#9B2226] text-white hover:bg-[#7a181b]',
    }
    const sizes = {
      sm: 'h-8 px-3 text-[10px]',
      md: 'h-10 px-4 py-2 text-[10px]',
      lg: 'h-12 px-8 text-xs',
    }

    return (
      <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded font-bold font-sans uppercase tracking-widest transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
