import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ExternalLink, Trash2, Activity, ChevronRight } from 'lucide-react';
import { WebhookSubscription } from '../../types';
import { webhooksApi } from '../../services/api';
import { formatDistanceToNow } from 'date-fns';

interface Props {
  webhook: WebhookSubscription;
  onCancelled: (id: string) => void;
}

export default function WebhookCard({ webhook, onCancelled }: Props) {
  const handleCancel = async () => {
    if (!confirm('Cancel this webhook subscription?')) return;
    try {
      await webhooksApi.cancel(webhook.id);
      toast.success('Webhook cancelled');
      onCancelled(webhook.id);
    } catch {
      toast.error('Failed to cancel webhook');
    }
  };

  return (
    <div className="card hover:border-blue-500/30 transition-colors group">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="badge badge-info">{webhook.eventType}</span>
            {webhook.isActive ? (
              <span className="badge badge-success">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                Active
              </span>
            ) : (
              <span className="badge badge-danger">Cancelled</span>
            )}
          </div>

          <p className="text-sm text-gray-300 truncate font-mono mt-2">
            {webhook.sourceUrl}
          </p>
          <p className="text-xs text-gray-600 truncate font-mono mt-0.5">
            → {webhook.callbackUrl}
          </p>

          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Activity className="w-3 h-3" />
              {webhook._count?.events ?? 0} events
            </span>
            <span>
              {formatDistanceToNow(new Date(webhook.createdAt), { addSuffix: true })}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {webhook.isActive && (
            <button
              onClick={handleCancel}
              className="p-1.5 text-gray-600 hover:text-red-400 transition-colors"
              title="Cancel webhook"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <Link
            to={`/webhooks/${webhook.id}`}
            className="p-1.5 text-gray-600 hover:text-blue-400 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
