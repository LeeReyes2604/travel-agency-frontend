import { useEffect, useState, useRef } from 'react';
import { API_ENDPOINTS } from '../../config/api';
import { auth } from '../../config/auth';
import * as ActionCable from '@rails/actioncable';
import { WS_ENDPOINT } from "../../config/api";

export interface Subscriber {
  id: number;
  email: string;
  name: string | null;
  subscribedDate: string | number | null;
  status: 'Active' | 'Unsubscribed';
}

export interface PaginationMeta {
  current_page: number;
  next_page: number | null;
  prev_page: number | null;
  total_pages: number;
  total_count: number;
}

const normalizeSubscriber = (subscriber: any): Subscriber => ({
  id: subscriber.id,
  email: subscriber.email,
  name: subscriber.name || null,
  subscribedDate:
    subscriber.subscribedDate ?? subscriber.subscribed_date ?? subscriber.created_at ?? subscriber.createdAt ?? null,
  status: subscriber.status === 'Unsubscribed' ? 'Unsubscribed' : 'Active',
});

export function useAdminSubscribers(page = 1) {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exportLoading, setExportLoading] = useState(false);
  const cableRef = useRef<any | null>(null);
  const subscriptionRef = useRef<any | null>(null);

  useEffect(() => {
    const fetchSubscribers = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = auth.getToken();
        if (!token) {
          throw new Error('Admin authentication is required to load subscribers.');
        }

        const response = await fetch(API_ENDPOINTS.adminSubscribers(page), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Unable to load subscribers.');
        }

        setSubscribers((data.subscribers || []).map(normalizeSubscriber));
        setMeta(data.meta || null);
      } catch (err: any) {
        setError(err?.message || 'Unable to load subscribers.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscribers();
  }, [page]);

  const exportSubscribers = async (onUpdate?: (update: any) => void) => {
    setExportLoading(true);

    try {
      const token = auth.getToken();
      if (!token) {
        throw new Error('Admin authentication is required to export subscribers.');
      }

      // Initiate export - server returns export_id (and optionally file_url)
      const response = await fetch(API_ENDPOINTS.adminSubscribersExport(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Unable to export subscribers.');
      }

      const exportId = data.export_id as string | undefined;

      // Server returns export_id; do not expect an immediate file_url
      if (!exportId) {
        throw new Error('No export_id returned from server; subscribe via WebSocket for updates.');
      }
      console.log(data.export_id)
      // Create ActionCable consumer if needed
      
      cableRef.current = ActionCable.createConsumer(WS_ENDPOINT);

      if (!cableRef.current) {

        const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
        cableRef.current = ActionCable.createConsumer(`${protocol}://${window.location.host}/cable`);
      }
      console.log(cableRef.current)
      subscriptionRef.current = cableRef.current.subscriptions.create(
        { channel: 'ExportChannel', export_id: exportId },
        {
          rejected() {
            console.log('ActionCable rejected');
          } ,
          connected() {
            console.log('ActionCable connected');
          },

          disconnected() {
            console.log('ActionCable disconnected');
          },
          received(update: any) {
            console.log('ActionCable payload:', update);

            if (typeof onUpdate === 'function') onUpdate(update);
          },
        }
      );

      return { exportId };
    } catch (err: any) {
      throw new Error(err?.message || 'Unable to export subscribers.');
    } finally {
      setExportLoading(false);
    }
  };

  // Cleanup websocket on unmount
  useEffect(() => {
    return () => {
      try {
        if (subscriptionRef.current && typeof subscriptionRef.current.unsubscribe === 'function') {
          subscriptionRef.current.unsubscribe();
        }
      } catch (e) {}

      try {
        if (cableRef.current && typeof cableRef.current.disconnect === 'function') {
          cableRef.current.disconnect();
        }
      } catch (e) {}
    };
  }, []);

  const unsubscribeExport = () => {
    try {
      if (subscriptionRef.current && typeof subscriptionRef.current.unsubscribe === 'function') {
        subscriptionRef.current.unsubscribe();
      }
    } catch (e) {}
    subscriptionRef.current = null;
  };

  return { subscribers, setSubscribers, meta, loading, error, exportSubscribers, exportLoading, unsubscribeExport };
}
