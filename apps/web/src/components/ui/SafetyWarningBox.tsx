import { AlertTriangle, Info, ShieldAlert } from 'lucide-react'
import { cn } from '@/lib/utils'

type Severity = 'info' | 'caution' | 'warning'

interface SafetyWarningBoxProps {
  severity?: Severity
  title?: string
  children: React.ReactNode
  className?: string
}

const CONFIG = {
  info: {
    className: 'info-box',
    Icon: Info,
    defaultTitle: 'Good to know',
  },
  caution: {
    className: 'safety-box',
    Icon: AlertTriangle,
    defaultTitle: 'Worth checking',
  },
  warning: {
    className: 'caution-box',
    Icon: ShieldAlert,
    defaultTitle: 'Important caution',
  },
}

export function SafetyWarningBox({
  severity = 'caution',
  title,
  children,
  className,
}: SafetyWarningBoxProps) {
  const { className: baseClass, Icon, defaultTitle } = CONFIG[severity]

  return (
    <aside className={cn(baseClass, className)} role="note" aria-label={title ?? defaultTitle}>
      <div className="flex gap-3">
        <Icon className="mt-0.5 shrink-0 size-4" aria-hidden="true" />
        <div>
          {(title ?? defaultTitle) && (
            <p className="font-semibold mb-1">{title ?? defaultTitle}</p>
          )}
          <div className="text-sm leading-relaxed">{children}</div>
        </div>
      </div>
    </aside>
  )
}
