import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, MapPin, Users, ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { API_ENDPOINTS } from '../../config/api';
import { auth } from '../../config/auth';
import { createHeaders } from "../../config/header";

interface TravelPackage {
  id: number;
  title: string;
  description: string;
  base_price: string;
  destination: string;
  number_of_travelers: number;
  show_price: boolean;
  is_active: boolean;
  image_url: string;
  created_at: string;
  updated_at: string;
}

interface Meta {
  current_page: number;
  next_page: number | null;
  prev_page: number | null;
  total_pages: number;
  total_count: number;
}

interface FormData {
  title: string;
  description: string;
  base_price: number;
  destination: string;
  number_of_travelers: number;
  show_price: boolean;
  is_active: boolean;
  image_data: string;
}

const defaultForm: FormData = {
  title: '',
  description: '',
  base_price: 0,
  destination: '',
  number_of_travelers: 1,
  show_price: true,
  is_active: true,
  image_data: '',
};

const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const getImageSrc = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}${url}`;
};

export default function PackageManagement() {
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<TravelPackage | null>(null);
  const [formData, setFormData] = useState<FormData>(defaultForm);
  const [imagePreview, setImagePreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const fetchPackages = async (p: number) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_ENDPOINTS.travelPackages}?page=${p}`, {
        headers: createHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch packages');
      setPackages(data.travel_packages);
      setMeta(data.meta);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages(page);
  }, [page]);

  const openAddModal = () => {
    setEditingPackage(null);
    setFormData(defaultForm);
    setImagePreview('');
    setSubmitError('');
    setIsModalOpen(true);
  };

  const openEditModal = (pkg: TravelPackage) => {
    setEditingPackage(pkg);
    setFormData({
      title: pkg.title,
      description: pkg.description,
      base_price: parseFloat(pkg.base_price),
      destination: pkg.destination,
      number_of_travelers: pkg.number_of_travelers,
      show_price: pkg.show_price,
      is_active: pkg.is_active,
      image_data: '',
    });
    setImagePreview(getImageSrc(pkg.image_url));
    setSubmitError('');
    setIsModalOpen(true);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await toBase64(file);
    setFormData((prev) => ({ ...prev, image_data: base64 }));
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');

    const payload: any = { travel_package: { ...formData } };
    if (!formData.image_data) delete payload.travel_package.image_data;

    try {
      const url = editingPackage
        ? API_ENDPOINTS.travelPackage(editingPackage.id)
        : API_ENDPOINTS.travelPackages;
      const method = editingPackage ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: createHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');

      setIsModalOpen(false);
      fetchPackages(page);
    } catch (err: any) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this package?')) return;
    try {
      const res = await fetch(API_ENDPOINTS.travelPackage(id), {
        method: 'DELETE',
        headers: createHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete');
      // if last item on page go back one page
      if (packages.length === 1 && page > 1) {
        setPage((p) => p - 1);
      } else {
        fetchPackages(page);
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2">Package Management</h1>
          <p className="text-muted-foreground">
            {meta ? `${meta.total_count} packages total` : 'Create and manage your tour packages'}
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus className="w-5 h-5" />
          <span>Add Package</span>
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          Loading packages...
        </div>
      ) : packages.length === 0 ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          No packages found.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div key={pkg.id} className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-muted overflow-hidden">
                  {pkg.image_url ? (
                    <img
                      src={getImageSrc(pkg.image_url)}
                      alt={pkg.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <ImageIcon className="w-10 h-10" />
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="mb-1">{pkg.title}</h3>
                      <span className={`inline-block px-2 py-1 rounded text-xs ${pkg.is_active ? 'bg-chart-4/20 text-chart-4' : 'bg-muted text-muted-foreground'}`}>
                        {pkg.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(pkg)}
                        className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(pkg.id)}
                        className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{pkg.description}</p>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{pkg.destination}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>{pkg.number_of_travelers} travelers</span>
                    </div>
                    {pkg.show_price && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-lg">₱{parseFloat(pkg.base_price).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {meta && meta.total_pages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={!meta.prev_page}
                className="p-2 rounded-lg border border-border hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm text-muted-foreground">
                Page {meta.current_page} of {meta.total_pages}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!meta.next_page}
                className="p-2 rounded-lg border border-border hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2>{editingPackage ? 'Edit Package' : 'Add New Package'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Destination</label>
                  <input
                    type="text"
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2">Base Price (₱)</label>
                  <input
                    type="number"
                    value={formData.base_price}
                    onChange={(e) => setFormData({ ...formData, base_price: Number(e.target.value) })}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Number of Travelers</label>
                  <input
                    type="number"
                    value={formData.number_of_travelers}
                    onChange={(e) => setFormData({ ...formData, number_of_travelers: Number(e.target.value) })}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" className="mt-2 h-40 w-full object-cover rounded-lg" />
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.show_price}
                    onChange={(e) => setFormData({ ...formData, show_price: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Show Price</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Active</span>
                </label>
              </div>

              {submitError && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg">
                  {submitError}
                </div>
              )}

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
                  disabled={submitting}
                  className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Saving...' : editingPackage ? 'Update Package' : 'Create Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}