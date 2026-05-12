import { Slot } from './slot.jsx'
import { cn } from '@/lib/utils'

const variants = {
  primary:
    'bg-[#C67C4E] text-white shadow-[0_18px_55px_rgba(198,124,78,0.35)] hover:bg-[#d98b58]',
  ghost:
    'border border-white/10 bg-white/5 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] hover:bg-white/10',
  cream: 'bg-[#F5F5F5] text-[#15110f] hover:bg-white',
}

export function Button({
  className,
  variant = 'primary',
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      className={cn(
        'inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-semibold transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFB067] active:scale-[0.98]',
        variants[variant],
        className,
      )}
      {...props}
    />
  )
}
