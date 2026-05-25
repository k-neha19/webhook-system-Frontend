import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { WebhookEvent } from '../types';

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const [liveEvents, setLiveEvents] = useState<WebhookEvent[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const url = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';
    socketRef.current = io(url, { transports: ['websocket', 'polling'] });

    socketRef.current.on('connect', () => setConnected(true));
    socketRef.current.on('disconnect', () => setConnected(false));

    socketRef.current.on('webhook_event', (event: WebhookEvent) => {
      setLiveEvents((prev) => [event, ...prev].slice(0, 50));
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  return { liveEvents, connected, clearEvents: () => setLiveEvents([]) };
}
