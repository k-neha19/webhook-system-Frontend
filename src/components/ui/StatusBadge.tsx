import { WebhookEvent } from '../../types';

export function StatusBadge({ status }: { status: WebhookEvent['status'] }) {
  const map = {
    DELIVERED: 'badge-success',
    FAILED: 'badge-danger',
    RETRYING: 'badge-warning',
    PENDING: 'badge-pending',
  } as const;

  const dots = {
    DELIVERED: 'bg-teal-400',
    FAILED: 'bg-red-400',
    RETRYING: 'bg-amber-400',
    PENDING: 'bg-gray-400',
  } as const;

  return (
    <span className={map[status]}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[status]}`} />
      {status}
    </span>
  );
}
