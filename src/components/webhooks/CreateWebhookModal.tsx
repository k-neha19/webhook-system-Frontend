import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { X, Plus } from 'lucide-react';
import { webhooksApi } from '../../services/api';
import { WebhookSubscription } from '../../types';

const EVENT_TYPES = [
  'push', 'pull_request', 'issues', 'release', 'deployment',
  'payment.success', 'payment.failed', 'order.created', 'order.updated',
  'user.created', 'user.updated', 'alert', 'custom', '*',
];

interface Props {
  onClose: () => void;
  onCreated: (webhook: WebhookSubscription) => void;
}

export default function CreateWebhookModal({ onClose, onCreated }: Props) {
  const [sourceUrl, setSourceUrl] = useState('');
  const [callbackUrl, setCallbackUrl] = useState('');
  const [eventType, setEventType] = useState('push');
  const [customType, setCustomType] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await webhooksApi.create({
        sourceUrl,
        callbackUrl,
        eventType: eventType === 'custom' ? customType : eventType,
      });
      toast.success('Webhook subscribed!');
      onCreated(data);
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create webhook');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="card w-full max-w-md animate-slide-in">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-400" />
            Subscribe to Webhook
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Source URL</label>
            <input
              type="url"
              className="input"
              placeholder="https://api.github.com/webhooks"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              required
            />
            <p className="text-xs text-gray-600 mt-1">The external service sending events</p>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Callback URL</label>
            <input
              type="url"
              className="input"
              placeholder="https://myapp.com/webhook/receive"
              value={callbackUrl}
              onChange={(e) => setCallbackUrl(e.target.value)}
              required
            />
            <p className="text-xs text-gray-600 mt-1">Where to forward incoming events</p>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Event Type</label>
            <select
              className="input"
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
            >
              {EVENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t === '*' ? '* (all events)' : t}
                </option>
              ))}
              <option value="custom">Custom...</option>
            </select>
          </div>

          {eventType === 'custom' && (
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Custom Event Type</label>
              <input
                type="text"
                className="input"
                placeholder="my.custom.event"
                value={customType}
                onChange={(e) => setCustomType(e.target.value)}
                required
              />
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1" disabled={loading}>
              {loading ? 'Subscribing...' : 'Subscribe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
