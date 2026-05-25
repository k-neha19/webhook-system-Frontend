export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface WebhookSubscription {
  id: string;
  sourceUrl: string;
  callbackUrl: string;
  eventType: string;
  isActive: boolean;
  secretKey: string;
  userId: string;
  createdAt: string;
  _count?: { events: number };
  events?: WebhookEvent[];
}

export interface WebhookEvent {
  id: string;
  payload: Record<string, any>;
  status: 'PENDING' | 'DELIVERED' | 'FAILED' | 'RETRYING';
  retryCount: number;
  webhookId: string;
  createdAt: string;
  webhook?: {
    sourceUrl: string;
    eventType: string;
    callbackUrl: string;
  };
}

export interface CreateWebhookDto {
  sourceUrl: string;
  callbackUrl: string;
  eventType: string;
}
