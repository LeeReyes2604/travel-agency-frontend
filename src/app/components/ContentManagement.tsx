import { useEffect, useState } from 'react';
import { Edit,  Megaphone, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { API_ENDPOINTS } from '../../config/api';
import { auth } from '../../config/auth';

interface Meta {
  current_page: number;
  next_page: number | null;
  prev_page: number | null;
  total_pages: number;
  total_count: number;
}

interface Promo {
  id: number;
  title: string;
  details: string;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}


type Tab = 'promos';

const keyValueColumns = [
  { name: 'key', label: 'Label', type: 'text' as const, placeholder: 'Main' },
  { name: 'value', label: 'Value', type: 'text' as const, required: true, placeholder: 'Value' },
];


const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${auth.getToken()}`,
});

export default function ContentManagement() {
  const [activeTab, setActiveTab] = useState<Tab>('promos');
  const [promos, setPromos] = useState<Promo[]>([]);
  const [promoMeta, setPromoMeta] = useState<Meta | null>(null);
  const [promoPage, setPromoPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [promoModalOpen, setPromoModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promo | null>(null);

  const [promoFormData, setPromoFormData] = useState<Omit<Promo, 'id'>>({
    title: '',
    details: '',
    active: true,
  });

  const fetchPromos = async (page = promoPage) => {
    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.adminPromos(page), {
        headers: { Authorization: `Bearer ${auth.getToken()}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to load promos.');
      setPromos(data.promos || []);
      setPromoMeta(data.meta || null);
    } catch (error: any) {
      toast.error(error?.message || 'Unable to load promos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromos(promoPage);
  }, [promoPage]);

  const openAddPromoModal = () => {
    setEditingPromo(null);
    setPromoFormData({ title: '', details: '', active: true });
    setPromoModalOpen(true);
  };

  const openEditPromoModal = (promo: Promo) => {
    setEditingPromo(promo);
    setPromoFormData({
      title: promo.title,
      details: promo.details,
      active: promo.active,
    });
    setPromoModalOpen(true);
  };

  const handlePromoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        editingPromo ? API_ENDPOINTS.adminPromo(editingPromo.id) : API_ENDPOINTS.adminPromos(),
        {
          method: editingPromo ? 'PATCH' : 'POST',
          headers: authHeaders(),
          body: JSON.stringify({ promo: promoFormData }),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to save promo.');
      toast.success(editingPromo ? 'Promo updated.' : 'Promo created.');
      setPromoModalOpen(false);
      fetchPromos(promoPage);
    } catch (error: any) {
      toast.error(error?.message || 'Unable to save promo.');
    }
  };

  const deletePromo = async (id: number) => {
    if (!confirm('Are you sure you want to delete this promo?')) return;
    try {
      const response = await fetch(API_ENDPOINTS.adminPromo(id), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${auth.getToken()}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to delete promo.');
      toast.success(data.message || 'Promo deleted.');
      fetchPromos(promoPage);
    } catch (error: any) {
      toast.error(error?.message || 'Unable to delete promo.');
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="mb-2">Content Management</h1>
        <p className="text-muted-foreground">Manage homepage promotions and public contact information</p>
      </div>

      <div className="flex gap-4 mb-6 border-b border-border">
        <button
          onClick={() => setActiveTab('promos')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
            activeTab === 'promos'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Megaphone className="w-5 h-5" />
          <span>Homepage Promos</span>
        </button>
      </div>

      {activeTab === 'promos' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              {promoMeta ? `${promoMeta.total_count} promos` : 'Homepage banner promotions'}
            </p>
            <button
              onClick={openAddPromoModal}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              <Plus className="w-5 h-5" />
              <span>New Promo</span>
            </button>
          </div>

          {loading && promos.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground">Loading promos...</div>
          ) : promos.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground">No promos found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {promos.map((promo) => (
                <div key={promo.id} className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3>{promo.title}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditPromoModal(promo)}
                        className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deletePromo(promo.id)}
                        className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4">{promo.details}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="text-sm text-muted-foreground">Promo #{promo.id}</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        promo.active ? 'bg-chart-4/20 text-chart-4' : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {promo.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {promoMeta && promoMeta.total_pages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={() => setPromoPage(promoMeta.prev_page || 1)}
                disabled={!promoMeta.prev_page}
                className="px-4 py-2 bg-card border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-muted-foreground">
                Page {promoMeta.current_page} of {promoMeta.total_pages}
              </span>
              <button
                onClick={() => setPromoPage(promoMeta.next_page || promoMeta.current_page)}
                disabled={!promoMeta.next_page}
                className="px-4 py-2 bg-card border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
      {promoModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-lg max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2>{editingPromo ? 'Edit Promo' : 'New Promo'}</h2>
              <button onClick={() => setPromoModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                x
              </button>
            </div>

            <form onSubmit={handlePromoSubmit} className="space-y-4">
              <div>
                <label htmlFor="promo-title" className="block text-sm mb-2">
                  Title
                </label>
                <input
                  id="promo-title"
                  type="text"
                  value={promoFormData.title}
                  onChange={(e) => setPromoFormData({ ...promoFormData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>

              <div>
                <label htmlFor="promo-details" className="block text-sm mb-2">
                  Details
                </label>
                <textarea
                  id="promo-details"
                  value={promoFormData.details}
                  onChange={(e) => setPromoFormData({ ...promoFormData, details: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  required
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  id="promo-active"
                  type="checkbox"
                  checked={promoFormData.active}
                  onChange={(e) => setPromoFormData({ ...promoFormData, active: e.target.checked })}
                  className="w-5 h-5 rounded border-border"
                />
                <label htmlFor="promo-active" className="text-sm">
                  Active
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setPromoModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                  {editingPromo ? 'Update Promo' : 'Create Promo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
