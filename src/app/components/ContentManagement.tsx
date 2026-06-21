import { useState } from 'react';
import { Plus, Edit, Trash2, Megaphone } from 'lucide-react';

interface Promo {
  id: number;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  isActive: boolean;
}

const initialPromos: Promo[] = [
  {
    id: 1,
    title: 'Summer Sale - Save 20%',
    description: 'Book any package before June 30th and save 20% on all destinations!',
    ctaText: 'Book Now',
    ctaLink: '/packages',
    isActive: true,
  },
  {
    id: 2,
    title: 'Early Bird Special',
    description: 'Reserve your 2027 trip now and get exclusive early bird pricing.',
    ctaText: 'Learn More',
    ctaLink: '/early-bird',
    isActive: false,
  },
];

export default function ContentManagement() {
  const [activeTab, setActiveTab] = useState<'promos'>('promos');
  const [promos, setPromos] = useState<Promo[]>(initialPromos);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promo | null>(null);

  const [promoFormData, setPromoFormData] = useState<Omit<Promo, 'id'>>({
    title: '',
    description: '',
    ctaText: '',
    ctaLink: '',
    isActive: true,
  });

  const openAddPromoModal = () => {
    setEditingPromo(null);
    setPromoFormData({
      title: '',
      description: '',
      ctaText: '',
      ctaLink: '',
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEditPromoModal = (promo: Promo) => {
    setEditingPromo(promo);
    setPromoFormData({
      title: promo.title,
      description: promo.description,
      ctaText: promo.ctaText,
      ctaLink: promo.ctaLink,
      isActive: promo.isActive,
    });
    setIsModalOpen(true);
  };

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPromo) {
      setPromos((prev) =>
        prev.map((promo) => (promo.id === editingPromo.id ? { ...promoFormData, id: promo.id } : promo))
      );
    } else {
      const newPromo = { ...promoFormData, id: Date.now() };
      setPromos((prev) => [...prev, newPromo]);
    }
    setIsModalOpen(false);
  };

  const deletePromo = (id: number) => {
    if (confirm('Are you sure you want to delete this promo?')) {
      setPromos((prev) => prev.filter((promo) => promo.id !== id));
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="mb-2">Content Management</h1>
        <p className="text-muted-foreground">Manage homepage promotions</p>
      </div>

      {/* Tabs */}
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

      {/* Promos Tab */}
      {activeTab === 'promos' && (
        <div>
          <div className="flex justify-end mb-6">
            <button
              onClick={openAddPromoModal}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              <Plus className="w-5 h-5" />
              <span>New Promo</span>
            </button>
          </div>

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
                <p className="text-muted-foreground mb-4">{promo.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className="text-sm text-muted-foreground">CTA: {promo.ctaText}</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      promo.isActive ? 'bg-chart-4/20 text-chart-4' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {promo.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Blog Modal */}
      {isModalOpen && activeTab === 'promos' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-lg max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2>{editingPromo ? 'Edit Promo' : 'New Promo'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                ✕
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
                <label htmlFor="promo-description" className="block text-sm mb-2">
                  Description
                </label>
                <textarea
                  id="promo-description"
                  value={promoFormData.description}
                  onChange={(e) => setPromoFormData({ ...promoFormData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="promo-cta-text" className="block text-sm mb-2">
                    CTA Button Text
                  </label>
                  <input
                    id="promo-cta-text"
                    type="text"
                    value={promoFormData.ctaText}
                    onChange={(e) => setPromoFormData({ ...promoFormData, ctaText: e.target.value })}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="promo-cta-link" className="block text-sm mb-2">
                    CTA Link
                  </label>
                  <input
                    id="promo-cta-link"
                    type="text"
                    value={promoFormData.ctaLink}
                    onChange={(e) => setPromoFormData({ ...promoFormData, ctaLink: e.target.value })}
                    placeholder="/packages"
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  id="promo-active"
                  type="checkbox"
                  checked={promoFormData.isActive}
                  onChange={(e) => setPromoFormData({ ...promoFormData, isActive: e.target.checked })}
                  className="w-5 h-5 rounded border-border"
                />
                <label htmlFor="promo-active" className="text-sm">
                  Active (show on homepage)
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
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
