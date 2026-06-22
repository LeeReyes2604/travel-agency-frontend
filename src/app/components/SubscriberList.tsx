import { useEffect, useState } from 'react';
import { Search, Download, Mail, Calendar, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { API_ENDPOINTS } from '../../config/api';
import { auth } from '../../config/auth';
import { useAdminSubscribers, Subscriber } from '../hooks/useAdminSubscribers';

const formatSubscriberDate = (value: string | number | null) => {
  if (value === null || value === undefined || value === '') return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString();
};

export default function SubscriberList() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const {
    subscribers,
    setSubscribers,
    meta,
    loading,
    error,
    exportSubscribers,
    exportLoading,
    unsubscribeExport,
  } = useAdminSubscribers(page, searchTerm);

  const [exportStatus, setExportStatus] = useState<'idle' | 'waiting'>('idle');
  const [exportProgress, setExportProgress] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('All');

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const filteredSubscribers = subscribers.filter((subscriber) => {
    const matchesStatus = statusFilter === 'All' || subscriber.status === statusFilter;
    return matchesStatus;
  });

  const deleteSubscriber = async (id: number) => {
    if (!confirm('Are you sure you want to delete this subscriber?')) {
      return;
    }

    try {
      const token = auth.getToken();
      if (!token) {
        throw new Error('Admin authentication is required to delete subscribers.');
      }

      const response = await fetch(API_ENDPOINTS.adminSubscriber(id), {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Unable to delete subscriber.');
      }

      toast.success(data.message || 'Subscriber deleted.');
      setSubscribers((prev) => prev.filter((s) => s.id !== id));
    } catch (error: any) {
      toast.error(error?.message || 'Unable to delete subscriber.');
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="mb-2">Newsletter Subscribers</h1>
        <p className="text-muted-foreground">Manage your newsletter subscription list</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-chart-1/10 rounded-lg">
              <Mail className="w-5 h-5 text-chart-1" />
            </div>
            <p className="text-sm text-muted-foreground">Total Subscribers</p>
          </div>
          <p className="text-3xl">{subscribers.length}</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-chart-4/10 rounded-lg">
              <Mail className="w-5 h-5 text-chart-4" />
            </div>
            <p className="text-sm text-muted-foreground">Active Subscribers</p>
          </div>
          <p className="text-3xl">{subscribers.filter((s) => s.status === 'Active').length}</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-chart-2/10 rounded-lg">
              <Calendar className="w-5 h-5 text-chart-2" />
            </div>
            <p className="text-sm text-muted-foreground">New This Week</p>
          </div>
          <p className="text-3xl">5</p>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-card border border-border rounded-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option>All</option>
            <option>Active</option>
            <option>Unsubscribed</option>
          </select>

          <div className="flex items-center gap-4">
            <button
              onClick={async () => {
                try {
                  setExportStatus('waiting');
                  setExportProgress(null);

                  await exportSubscribers((update: any) => {
                    switch (update.status) {
                      case 'started':
                        toast.success(
                          `Export started: ${update.filename || ''} (${update.total_rows ?? ''} rows)`,
                          { duration: 3000 }
                        );
                        break;
                      case 'progress':
                        setExportProgress(update.rows_written ?? null);
                        break;
                      case 'completed':
                        try {
                          if (update.file_url) {
                            window.open(update.file_url, '_blank');
                            toast.success('Download started');
                          }
                        } catch (e) {}
                        try {
                          if (typeof unsubscribeExport === 'function') unsubscribeExport();
                        } catch (e) {}
                        setExportStatus('idle');
                        break;
                      case 'failed':
                        try {
                          if (typeof unsubscribeExport === 'function') unsubscribeExport();
                        } catch (e) {}
                        setExportStatus('idle');
                        toast.error(update.error || 'Export failed');
                        break;
                    }
                  });
                } catch (err: any) {
                  setExportStatus('idle');
                  toast.error(err?.message || 'Export failed.');
                }
              }}
              disabled={exportLoading || exportStatus === 'waiting'}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-5 h-5" />
              <span>{exportStatus === 'waiting' ? 'Please wait' : exportLoading ? 'Exporting…' : 'Export CSV'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Subscribers Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">Email</th>
                <th className="text-left p-4">Subscribed Date</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredSubscribers.map((subscriber) => (
                <tr key={subscriber.id} className="hover:bg-accent/50 transition-colors">
                  <td className="p-4">{subscriber.name || '—'}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>{subscriber.email}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{formatSubscriberDate(subscriber.subscribedDate)}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm ${
                        subscriber.status === 'Active'
                          ? 'bg-chart-4/20 text-chart-4'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {subscriber.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => deleteSubscriber(subscriber.id)}
                      className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                      title="Delete subscriber"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredSubscribers.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            {loading ? 'Loading subscribers…' : 'No subscribers found matching your criteria.'}
          </div>
        )}
      </div>

      {meta && (
        <div className="mt-4 flex items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            Page {meta.current_page} of {meta.total_pages}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(meta.prev_page || 1)}
              disabled={!meta.prev_page}
              className="px-4 py-2 bg-card border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(meta.next_page || meta.current_page)}
              disabled={!meta.next_page}
              className="px-4 py-2 bg-card border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
