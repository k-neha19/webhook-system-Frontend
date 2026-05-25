import { Wifi, WifiOff, Trash2, Zap } from 'lucide-react';
import { WebhookEvent } from '../../types';
import { StatusBadge } from '../ui/StatusBadge';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';

interface Props {
  events: WebhookEvent[];
  connected: boolean;
  onClear: () => void;
}

export default function LiveEventLog({ events, connected, onClear }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <h2 className="font-semibold text-white">Live Event Stream</h2>
          <span className="text-xs text-gray-600">({events.length})</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            {connected ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-teal-400" />
                <span className="text-xs text-teal-400">Live</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-xs text-gray-500">Disconnected</span>
              </>
            )}
          </div>
          {events.length > 0 && (
            <button
              onClick={onClear}
              className="text-gray-600 hover:text-gray-400 transition-colors"
              title="Clear log"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-10">
          <div className="w-10 h-10 rounded-full bg-[#12141c] border border-[#2a2d3a] flex items-center justify-center mx-auto mb-3">
            <Zap className="w-5 h-5 text-gray-600" />
          </div>
          <p className="text-gray-600 text-sm">Waiting for events...</p>
          <p className="text-gray-700 text-xs mt-1">Events will appear here in real-time</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-[#12141c] border border-[#2a2d3a] rounded-lg overflow-hidden cursor-pointer"
              onClick={() => setExpanded(expanded === event.id ? null : event.id)}
            >
              <div className="flex items-center gap-3 px-3 py-2">
                <StatusBadge status={event.status} />
                {(event as any).webhookEventType && (
                  <span className="text-xs text-gray-500 font-mono">
                    {(event as any).webhookEventType}
                  </span>
                )}
                <span className="text-xs text-gray-600 ml-auto">
                  {formatDistanceToNow(new Date(event.createdAt), { addSuffix: true })}
                </span>
              </div>
              {expanded === event.id && (
                <div className="border-t border-[#2a2d3a] px-3 py-2 bg-[#0f1117]">
                  <pre className="text-xs text-gray-400 font-mono overflow-x-auto max-h-32">
                    {JSON.stringify(event.payload, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
