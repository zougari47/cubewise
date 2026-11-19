import { ArrowLeft, ArrowRight } from 'lucide-react'
import type { ComponentProps } from 'react'
import { cn } from '#/lib/utils'

/** An arrow that points the way the text runs: right, or left in a right-to-left language. */
export function ForwardArrow({ className, ...props }: ComponentProps<typeof ArrowRight>) {
  return <ArrowRight {...props} className={cn('rtl:rotate-180', className)} />
}

/** An arrow that points back to where the text came from: left, or right in a right-to-left language. */
export function BackArrow({ className, ...props }: ComponentProps<typeof ArrowLeft>) {
  return <ArrowLeft {...props} className={cn('rtl:rotate-180', className)} />
}
