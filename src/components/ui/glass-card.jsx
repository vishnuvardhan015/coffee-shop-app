import { cn } from '@/lib/utils'

export function GlassCard({ className, children }) {
  return (
    <div
      className={cn(
        'rounded-[28px] border border-white/10 bg-white/[0.07] shadow-[0_28px_90px_rgba(0,0,0,0.42)] backdrop-blur-2xl',
        className,
      )}
    >
      {children}
    </div>
  )
}
