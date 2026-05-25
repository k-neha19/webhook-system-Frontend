import { useState, useEffect, useCallback } from 'react';
import { Plus, Webhook, Filter, RefreshCw } from 'lucide-react';
import { webhooksApi, eventsApi } from '../services/api';
import { WebhookSubscription, WebhookEvent } from '../types';
import { useSocket } from '../hooks/useSocket';
import WebhookCard from '../components/webhooks/WebhookCard';
import CreateWebhookModal from '../components/webhooks/CreateWebhookModal';
import EventRow from '../components/events/EventRow';
import LiveEventLog from '../components/events/LiveEventLog';

const STATUS_FILTERS = ['ALL', 'PENDING', 'DELIVERED', 'FAILED', 'RETRYING'];

export default function DashboardPage() {
  const [webhooks, setWebhooks] = useState<WebhookSubscription[]>([]);
  const [events, setEvents] = useState<WebhookEvent[]>([]);
  const [loadingWebhooks, setLoadingWebhooks] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [eventTypeFilter, setEventTypeFilter] = useState('');
  const { liveEvents, connected, clearEvents } = useSocket();

  const fetchWebhooks = useCallback(async () => {
    try {
      const { data } = await webhooksApi.list(eventTypeFilter || undefined);
      setWebhooks(data);
    } finally {
      setLoadingWebhooks(false);
    }
  }, [eventTypeFilter]);

  const fetchEvents = useCallback(async () => {
    try {
      const { data } = await eventsApi.list({
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
      });
      setEvents(data);
    } finally {
      setLoadingEvents(false);
    }
  }, [statusFilter]);

  useEffect(() => { fetchWebhooks(); }, [fetchWebhooks]);
  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const activeWebhooks = webhooks.filter((w) => w.isActive);
  const totalEvents = events.length;
  const failedEvents = events.filter((e) => e.status === 'FAILED').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage your webhook subscriptions</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Webhook
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Subscriptions', value: webhooks.length, color: 'text-white' },
          { label: 'Active', value: activeWebhooks.length, color: 'text-teal-400' },
          { label: 'Total Events', value: totalEvents, color: 'text-blue-400' },
          { label: 'Failed', value: failedEvents, color: failedEvents > 0 ? 'text-red-400' : 'text-white' },
        ].map((stat) => (
          <div key={stat.label} className="card text-center">
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Webhooks */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <Webhook className="w-4 h-4 text-blue-400" />
              Subscriptions
            </h2>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Filter by type"
                className="input w-32 text-xs py-1.5"
                value={eventTypeFilter}
                onChange={(e) => setEventTypeFilter(e.target.value)}
              />
              <button onClick={fetchWebhooks} className="p-1.5 text-gray-500 hover:text-gray-300">
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {loadingWebhooks ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card animate-pulse h-24 bg-[#1a1d27]" />
              ))}
            </div>
          ) : webhooks.length === 0 ? (
            <div className="card text-center py-10">
              <Webhook className="w-8 h-8 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No webhooks yet</p>
              <button
                onClick={() => setShowCreate(true)}
                className="text-blue-400 text-sm mt-2 hover:text-blue-300"
              >
                Create your first subscription →
              </button>
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {webhooks.map((webhook) => (
                <WebhookCard
                  key={webhook.id}
                  webhook={webhook}
                  onCancelled={(id) =>
                    setWebhooks((prev) =>
                      prev.map((w) => (w.id === id ? { ...w, isActive: false } : w)),
                    )
                  }
                />
              ))}
            </div>
          )}
        </div>

        {/* Live events */}
        <LiveEventLog
          events={liveEvents}
          connected={connected}
          onClear={clearEvents}
        />
      </div>

      {/* Events table */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-white flex items-center gap-2">
            <Filter className="w-4 h-4 text-blue-400" />
            Event History
          </h2>
          <div className="flex items-center gap-2">
            <div className="flex bg-[#12141c] rounded-lg border border-[#2a2d3a] p-0.5">
              {STATUS_FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${
                    statusFilter === f
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <button onClick={fetchEvents} className="p-1.5 text-gray-500 hover:text-gray-300">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {loadingEvents ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-[#12141c] rounded-lg animate-pulse" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <p className="text-center text-gray-600 py-8 text-sm">No events found</p>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {events.map((event) => (
              <EventRow key={event.id} event={event} onRetried={fetchEvents} />
            ))}
          </div>
        )}
      </div>

      {showCreate && (
        <CreateWebhookModal
          onClose={() => setShowCreate(false)}
          onCreated={(webhook) => setWebhooks((prev) => [webhook, ...prev])}
        />
      )}
    </div>
  );
}
