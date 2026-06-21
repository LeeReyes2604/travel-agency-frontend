import { useState, useEffect } from 'react';
import { Search, Filter, Mail, Phone, Calendar, MapPin, Users, DollarSign, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { API_ENDPOINTS, getImageSrc } from '../../config/api';
import { auth } from '../../config/auth';
import { TravelPackage } from './customer/TravelPackageCard';

interface Inquiry {
  id: number;
  full_name: string;
  email: string;
  phone_number: string | null;
  destination: string | null;
  departure_date: string | null;
  return_date: string | null;
  number_of_travelers: number | null;
  estimated_budget: string | null;
  notes: string | null;
  status: 'pending' | 'quoted' | 'confirmed' | 'cancelled';
  travel_package_title: string | null;
  travel_package_id: number | null;
  created_at: string;
}

interface Meta {
  current_page: number;
  next_page: number | null;
  prev_page: number | null;
  total_pages: number;
  total_count: number;
}

const STATUS_OPTIONS = ['pending', 'quoted', 'confirmed', 'cancelled'] as const;

const getStatusColor = (status: Inquiry['status']) => {
  switch (status) {
    case 'confirmed': return 'bg-chart-4/20 text-chart-4';
    case 'quoted': return 'bg-chart-2/20 text-chart-2';
    case 'cancelled': return 'bg-destructive/20 text-destructive';
    default: return 'bg-chart-1/20 text-chart-1';
  }
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const formatDate = (date: string | null) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' });
};

export default function InquiryManagement() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<TravelPackage | null>(null);
  const [packageLoading, setPackageLoading] = useState(false);
  const [packageError, setPackageError] = useState('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchInquiries = async (p: number) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_ENDPOINTS.adminInquiries}?page=${p}`, {
        headers: { Authorization: `Bearer ${auth.getToken()}` },
      });
      const data = await res.json();
 
      if (!res.ok) throw new Error(data.error || 'Failed to fetch inquiries');
      setInquiries(data.inquiries);
      setMeta(data.meta);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries(page);
  }, [page]);

  const updateStatus = async (id: number, status: Inquiry['status']) => {
    setUpdatingId(id);
    try {
      const res = await fetch(API_ENDPOINTS.adminInquiry(id), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.getToken()}`,
        },
        body: JSON.stringify({ inquiry: { status } }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to update status');
      setInquiries((prev) => prev.map((i) => (i.id === id ? data : i)));
      if (selectedInquiry?.id === id) setSelectedInquiry(data);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const fetchTravelPackage = async (id: number) => {
    setPackageLoading(true);
    setPackageError('');
    try {
      const res = await fetch(API_ENDPOINTS.travelPackage(id), {
        headers: { Authorization: `Bearer ${auth.getToken()}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch travel package');
      return data.travel_package ?? data;
    } catch (err: any) {
      setPackageError(err.message);
      return null;
    } finally {
      setPackageLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedInquiry?.travel_package_id) {
      setSelectedPackage(null);
      setPackageError('');
      return;
    }

    fetchTravelPackage(selectedInquiry.travel_package_id).then((pkg) => {
      setSelectedPackage(pkg);
    });
  }, [selectedInquiry]);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      const res = await fetch(API_ENDPOINTS.adminInquiry(id), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${auth.getToken()}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete');
      setSelectedInquiry(null);
      if (inquiries.length === 1 && page > 1) {
        setPage((p) => p - 1);
      } else {
        fetchInquiries(page);
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchesSearch =
      inquiry.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inquiry.destination?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesStatus = statusFilter === 'All' || inquiry.status === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="mb-2">Inquiry Management</h1>
        <p className="text-muted-foreground">
          {meta ? `${meta.total_count} total inquiries` : 'View and manage customer tour inquiries'}
        </p>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, email, or destination..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
            >
              <option>All</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{capitalize(s)}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20 text-muted-foreground">
              Loading inquiries...
            </div>
          ) : filteredInquiries.length === 0 ? (
            <div className="flex items-center justify-center py-20 text-muted-foreground">
              No inquiries found.
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-4">Customer</th>
                  <th className="text-left p-4">Travel Package</th>
                  <th className="text-left p-4">Destination</th>
                  <th className="text-left p-4">Date Submitted</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredInquiries.map((inquiry) => (
                  <tr key={inquiry.id} className="hover:bg-accent/50 transition-colors">
                    <td className="p-4">
                      <p>{inquiry.full_name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <Mail className="w-3 h-3" />
                        <span>{inquiry.email}</span>
                      </div>
                      {inquiry.phone_number && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <Phone className="w-3 h-3" />
                          <span>{inquiry.phone_number}</span>
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm">
                        <span>{inquiry.travel_package_title ?? '—'}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{inquiry.destination ?? '—'}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>{formatDate(inquiry.created_at)}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <select
                        value={inquiry.status}
                        onChange={(e) => updateStatus(inquiry.id, e.target.value as Inquiry['status'])}
                        disabled={updatingId === inquiry.id}
                        className={`px-3 py-1 rounded-full text-sm ${getStatusColor(inquiry.status)} border-none cursor-pointer disabled:opacity-50`}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{capitalize(s)}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedInquiry(inquiry)}
                          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity text-sm"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDelete(inquiry.id)}
                          className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Pagination */}
      {meta && meta.total_pages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
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

      {/* Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="mb-2">Inquiry Details</h2>
                <span className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusColor(selectedInquiry.status)}`}>
                  {capitalize(selectedInquiry.status)}
                </span>
              </div>
              <button onClick={() => setSelectedInquiry(null)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>

            <div className={selectedInquiry.travel_package_id ? 'grid gap-6 lg:grid-cols-[360px_1fr]' : 'space-y-4'}>
              {selectedInquiry.travel_package_id ? (
                <div className="space-y-4">
                  <div className="rounded-3xl overflow-hidden bg-slate-50 shadow-sm">
                    {selectedPackage ? (
                      <>
                        {selectedPackage.image_url ? (
                          <img
                            src={getImageSrc(selectedPackage.image_url)}
                            alt={selectedPackage.title}
                            className="w-full h-56 object-cover"
                          />
                        ) : (
                          <div className="w-full h-56 bg-muted flex items-center justify-center text-muted-foreground text-sm">
                            No image
                          </div>
                        )}
                        <div className="p-6">
                          <h3 className="text-xl font-semibold mb-3">{selectedPackage.title}</h3>
                          <p className="text-sm text-muted-foreground mb-4">{selectedPackage.destination}</p>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                            <Users className="w-4 h-4" />
                            <span>{selectedPackage.number_of_travelers} traveler{selectedPackage.number_of_travelers === 1 ? '' : 's'}</span>
                          </div>
                          {selectedPackage.show_price && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                              <DollarSign className="w-4 h-4" />
                              <span>From ₱{parseFloat(selectedPackage.base_price).toLocaleString()}</span>
                            </div>
                          )}
                          {selectedPackage.description && (
                            <p className="text-sm text-muted-foreground leading-relaxed">{selectedPackage.description}</p>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="p-6">
                        {packageLoading ? (
                          <p className="text-sm text-muted-foreground">Loading package details…</p>
                        ) : packageError ? (
                          <p className="text-sm text-destructive">Unable to load package details.</p>
                        ) : (
                          <p className="text-sm text-muted-foreground">No package details available.</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : null}

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground">Customer Name</label>
                  <p>{selectedInquiry.full_name}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Email</label>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <p>{selectedInquiry.email}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Phone</label>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <p>{selectedInquiry.phone_number ?? '—'}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Destination</label>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <p>{selectedInquiry.destination ?? '—'}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Travelers</label>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <p>{selectedInquiry.number_of_travelers ?? '—'}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Departure Date</label>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <p>{formatDate(selectedInquiry.departure_date)}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Return Date</label>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <p>{formatDate(selectedInquiry.return_date)}</p>
                    </div>
                  </div>
                </div>

                {selectedInquiry.estimated_budget && (
                  <div>
                    <label className="text-sm text-muted-foreground">Estimated Budget</label>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <p>₱{parseFloat(selectedInquiry.estimated_budget).toLocaleString()}</p>
                    </div>
                  </div>
                )}

                {selectedInquiry.notes && (
                  <div>
                    <label className="text-sm text-muted-foreground">Notes</label>
                    <p className="bg-accent/50 p-4 rounded-lg text-sm">{selectedInquiry.notes}</p>
                  </div>
                )}

                <div>
                  <label className="text-sm text-muted-foreground">Update Status</label>
                  <select
                    value={selectedInquiry.status}
                    onChange={(e) => updateStatus(selectedInquiry.id, e.target.value as Inquiry['status'])}
                    disabled={updatingId === selectedInquiry.id}
                    className="w-full mt-1 px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{capitalize(s)}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setSelectedInquiry(null)}
                className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                Close
              </button>
              <button
                onClick={() => handleDelete(selectedInquiry.id)}
                className="flex-1 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                Delete Inquiry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}