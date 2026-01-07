import { ButtonHTMLAttributes, ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonPrimaryVariants = cva(
  'text-sm font-semibold px-5 py-4 leading-none cursor-pointer rounded-full border transition-all ease-in-out duration-200 font-[Helvetica]',
  {
    variants: {
      variant: {
        default: 'bg-[#28dcb2e3] text-black border-[#00dba8a5] shadow-inner shadow-[#00ffc3db] backdrop-blur-md hover:bg-[#f6f6f6] hover:shadow-[#ffffff] hover:border-black',
        destructive: 'bg-red-700/20 text-zinc-300 border-zinc-200/20 shadow-inner shadow-[#00ffc3db] backdrop-blur-md hover:bg-red-700/70 hover:text-white',
        secondary: 'bg-[#00835e]/20 text-zinc-100 border-zinc-200/20 shadow-inner shadow-[#00ffc3db] backdrop-blur-md hover:bg-[#00382c] hover:bg-[#00835e]/70 hover:text-white  transition-all duration-200',
        outline: 'bg-transparent text-white border-zinc-200/20 shadow-inner shadow-[#00ffc3db] backdrop-blur-md hover:bg-[#00382c] hover:text-white',
        dark: 'bg-black text-white border-black hover:bg-[#1a1a1a]',
        ghost: 'bg-transparent text-black border-transparent hover:bg-gray-100',
      },
      size: {
        sm: 'px-5 py-2 text-sm',
        md: 'px-5 py-4 text-sm',
        lg: 'px-7 py-5 text-base',
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed hover:bg-[#28dcb2e3]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface ButtonPrimaryProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'>,
    VariantProps<typeof buttonPrimaryVariants> {
  children: ReactNode
}

export default function ButtonPrimary({
  className,
  variant,
  size,
  disabled,
  onClick,
  children,
  ...props
}: ButtonPrimaryProps) {
  return (
    <button
      className={cn(buttonPrimaryVariants({ variant, size, disabled }), className)}
      onClick={onClick}
      disabled={disabled ?? undefined}
      {...props}
    >
      {children}
    </button>
  )
}
