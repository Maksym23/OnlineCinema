import { useT } from '../../i18n'
import type { TKey } from '../../i18n'
import type { PaymentStatus, PlanId, UserStatus } from '../../data/admin'
import type { Lang } from '../../types'
import { planName } from './format'

export function PlanBadge({ plan, lang }: { plan: PlanId | null; lang: Lang }) {
  const t = useT()
  if (!plan) return <span className="adm-badge plan-none">{t('admin.noPlan')}</span>
  return <span className={`adm-badge plan-${plan}`}>{planName(plan, lang)}</span>
}

const STATUS_KEY: Record<UserStatus, TKey> = {
  active: 'admin.status.active',
  pending: 'admin.status.pending',
  blocked: 'admin.status.blocked',
}
export function StatusText({ status }: { status: UserStatus }) {
  const t = useT()
  return <span className={`adm-status st-${status}`}>{t(STATUS_KEY[status])}</span>
}

const PAY_KEY: Record<PaymentStatus, TKey> = { paid: 'admin.pay.paid', refund: 'admin.pay.refund', failed: 'admin.pay.failed' }
export function PayStatus({ status }: { status: PaymentStatus }) {
  const t = useT()
  return <span className={`adm-status pay-${status}`}>{t(PAY_KEY[status])}</span>
}

export function Pager({ page, pages, onPage }: { page: number; pages: number; onPage: (p: number) => void }) {
  const t = useT()
  if (pages <= 1) return null
  return (
    <div className="adm-pager">
      <button type="button" className="btn btn-dark btn-sm" disabled={page <= 1} onClick={() => onPage(page - 1)}>
        {t('admin.prev')}
      </button>
      <span className="muted small">{t('admin.page', { p: page, n: pages })}</span>
      <button type="button" className="btn btn-dark btn-sm" disabled={page >= pages} onClick={() => onPage(page + 1)}>
        {t('admin.next')}
      </button>
    </div>
  )
}
