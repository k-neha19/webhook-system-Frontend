import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { RefreshCw, X, ChevronDown, ChevronUp } from 'lucide-react';
import { WebhookEvent } from '../../types';
import { eventsApi } from '../../services/api';
import { StatusBadge } from '../ui/StatusBadge';
import { formatDistanceToNow } from 'date-fns';

interface Props {
  event: WebhookEvent;
  onRetried?: () => void;
  compact?: boolean;
}

export default function EventRow({ event, onRetried, compact }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [retrying, setRetrying] = useState(false);

  const handleRetry = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setRetrying(true);
    try {
      await eventsApi.retry(event.id);
      toast.success('Retry initiated');
      onRetried?.();
    } catch {
      toast.error('Retry failed');
    } finally {
      setRetrying(false);
    }
  };

  return (
    <div className="border border-[#2a2d3a] rounded-lg overflow-hidden">
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white/[0.02] transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <StatusBadge status={event.status} />

        {event.webhook && !compact && (
          <span className="text-xs text-gray-500 font-mono truncate max-w-[160px]">
            {event.webhook.eventType}
          </span>
        )}

        <span className="text-xs text-gray-600 ml-auto shrink-0">
          {formatDistanceToNow(new Date(event.createdAt), { addSuffix: true })}
        </span>

        {event.retryCount > 0 && (
          <span className="text-xs text-amber-500">×{event.retryCount}</span>
        )}

        {event.status === 'FAILED' && (
          <button
            onClick={handleRetry}
            disabled={retrying}
            className="p-1 text-blue-400 hover:text-blue-300 transition-colors disabled:opacity-50"
            title="Retry"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${retrying ? 'animate-spin' : ''}`} />
          </button>
        )}

        {expanded ? (
          <ChevronUp className="w-3.5 h-3.5 text-gray-600" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-gray-600" />
        )}
      </div>

      {expanded && (
        <div className="border-t border-[#2a2d3a] bg-[#12141c] px-4 py-3">
          <p className="text-xs text-gray-500 mb-2 font-mono">Event ID: {event.id}</p>
          <pre className="text-xs text-gray-300 font-mono overflow-x-auto bg-[#0f1117] rounded p-3 max-h-48">
            {JSON.stringify(event.payload, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
