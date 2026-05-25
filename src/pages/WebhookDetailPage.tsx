import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Copy, CheckCheck, Activity, Key } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { webhooksApi } from '../services/api';
import { WebhookSubscription } from '../types';
import EventRow from '../components/events/EventRow';
import { StatusBadge } from '../components/ui/StatusBadge';
import { formatDistanceToNow } from 'date-fns';

export default function WebhookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [webhook, setWebhook] = useState<WebhookSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    webhooksApi
      .get(id)
      .then(({ data }) => setWebhook(data))
      .catch(() => toast.error('Failed to load webhook'))
      .finally(() => setLoading(false));
  }, [id]);

  const copySecret = () => {
    if (!webhook) return;
    navigator.clipboard.writeText(webhook.secretKey);
    setCopied(true);
    toast.success('Secret copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-40 bg-[#1a1d27] rounded" />
        <div className="card h-40" />
      </div>
    );
  }

  if (!webhook) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Webhook not found</p>
        <Link to="/dashboard" className="text-blue-400 text-sm mt-2 block">
          ← Back to dashboard
        </Link>
      </div>
    );
  }

  const incomingUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/events/incoming/${webhook.id}`;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Link
          to="/dashboard"
          className="p-2 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white">Webhook Details</h1>
          <p className="text-gray-500 text-xs font-mono">{webhook.id}</p>
        </div>
        {webhook.isActive ? (
          <span className="badge badge-success ml-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            Active
          </span>
        ) : (
          <span className="badge badge-danger ml-auto">Cancelled</span>
        )}
      </div>

      {/* Info cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="card space-y-3">
          <h3 className="text-sm font-medium text-gray-400">Configuration</h3>
          <div className="space-y-2">
            <div>
              <p className="text-xs text-gray-600">Event Type</p>
              <span className="badge badge-info mt-1">{webhook.eventType}</span>
            </div>
            <div>
              <p className="text-xs text-gray-600">Source URL</p>
              <p className="text-sm font-mono text-gray-300 break-all">{webhook.sourceUrl}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Callback URL</p>
              <p className="text-sm font-mono text-gray-300 break-all">{webhook.callbackUrl}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Created</p>
              <p className="text-sm text-gray-400">
                {formatDistanceToNow(new Date(webhook.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
        </div>

        <div className="card space-y-3">
          <h3 className="text-sm font-medium text-gray-400 flex items-center gap-2">
            <Key className="w-3.5 h-3.5" />
            Incoming Endpoint
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-600 mb-1">POST to this URL to trigger events</p>
              <div className="flex items-center gap-2 bg-[#12141c] border border-[#2a2d3a] rounded-lg px-3 py-2">
                <code className="text-xs text-blue-300 font-mono flex-1 break-all">
                  {incomingUrl}
                </code>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Signing Secret</p>
              <div className="flex items-center gap-2 bg-[#12141c] border border-[#2a2d3a] rounded-lg px-3 py-2">
                <code className="text-xs text-gray-400 font-mono flex-1 blur-sm hover:blur-none transition-all">
                  {webhook.secretKey}
                </code>
                <button
                  onClick={copySecret}
                  className="text-gray-500 hover:text-gray-300 shrink-0"
                >
                  {copied ? (
                    <CheckCheck className="w-3.5 h-3.5 text-teal-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Events */}
      <div className="card">
        <h3 className="font-medium text-white flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-blue-400" />
          Event History
          <span className="text-gray-600 text-sm font-normal">
            ({webhook.events?.length ?? 0} events)
          </span>
        </h3>

        {!webhook.events?.length ? (
          <div className="text-center py-10">
            <p className="text-gray-600 text-sm">No events yet</p>
            <p className="text-gray-700 text-xs mt-1">
              Send a POST to the incoming endpoint above
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {webhook.events.map((event) => (
              <EventRow key={event.id} event={event} compact />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
