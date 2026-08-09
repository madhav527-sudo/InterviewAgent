interface ProgressBarProps {
  value: number
  className?: string
  color?: string
}

export default function ProgressBar({ value, className = '', color = 'bg-orange-500' }: ProgressBarProps) {
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-zinc-200 ${className}`}>
      <div
        className={`h-full rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}
