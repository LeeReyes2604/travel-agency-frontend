import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  ArrowLeft,
  MapPin,
  Users,
  DollarSign,
  Calendar,
  User,
  Mail,
  Phone,
  MessageSquare,
  Send,
} from 'lucide-react';
import { toast } from 'sonner';
import { API_ENDPOINTS, getImageSrc } from '../../../config/api';
import { TravelPackage } from './TravelPackageCard';

const defaultForm = {
  full_name: '',
  email: '',
  phone_number: '',
  number_of_travelers: 1,
  notes: '',
};

export default function PackageDetailPage() {
  const params = useParams();
  const navigate = useNavigate();
  const [travelPackage, setTravelPackage] = useState<TravelPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState(defaultForm);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const fetchPackage = async () => {
      if (!params.id) return;
      setLoading(true);
      setError('');

      try {
        const res = await fetch(API_ENDPOINTS.clientTravelPackage(Number(params.id)));
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load package');
        setTravelPackage(data.travel_package ?? data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!travelPackage) return;

    setSubmitLoading(true);
    setSubmitError('');

    try {
      const res = await fetch(API_ENDPOINTS.clientTravelPackageInquire(travelPackage.id), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inquiry: {
            full_name: formData.full_name,
            email: formData.email,
            phone_number: formData.phone_number || null,
            number_of_travelers: formData.number_of_travelers,
            notes: formData.notes || null,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');

      toast.success("Your inquiry has been submitted! We'll contact you soon.");
      setFormData(defaultForm);
    } catch (err: any) {
      setSubmitError(err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <button
          type="button"
          onClick={() => navigate('/packages')}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to packages
        </button>

        {loading ? (
          <div className="mt-12 flex items-center justify-center py-20 text-muted-foreground">
            Loading package...
          </div>
        ) : error ? (
          <div className="mt-12 rounded-3xl border border-destructive/20 bg-destructive/10 p-6 text-destructive">
            {error}
          </div>
        ) : travelPackage ? (
          <div className="mt-10 grid gap-10 xl:grid-cols-[1.75fr_1fr]">
            <div className="space-y-8">
              <div className="overflow-hidden rounded-[30px] shadow-lg border border-border bg-card">
                {travelPackage.image_url ? (
                  <img
                    src={getImageSrc(travelPackage.image_url)}
                    alt={travelPackage.title}
                    className="w-full h-[420px] object-cover"
                  />
                ) : (
                  <div className="w-full h-[420px] bg-muted flex items-center justify-center text-muted-foreground text-sm">
                    No image
                  </div>
                )}
              </div>

              <div className="rounded-[30px] border border-border bg-card p-8 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h1 className="text-4xl font-semibold mb-2">{travelPackage.title}</h1>
                    <p className="text-muted-foreground">{travelPackage.destination}</p>
                  </div>
                  <div className="rounded-3xl bg-primary/10 px-5 py-3 text-right">
                    {travelPackage.show_price && (
                      <>
                        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Starting from</p>
                        <p className="mt-2 text-3xl font-semibold text-primary">
                          ₱{parseFloat(travelPackage.base_price).toLocaleString()}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3 mt-8">
                  <div className="rounded-3xl bg-secondary/60 p-4 text-sm text-muted-foreground">
                    <div className="font-semibold text-foreground">Travelers</div>
                    <p>{travelPackage.number_of_travelers}</p>
                  </div>
                  <div className="rounded-3xl bg-secondary/60 p-4 text-sm text-muted-foreground">
                    <div className="font-semibold text-foreground">Destination</div>
                    <p>{travelPackage.destination}</p>
                  </div>
                  <div className="rounded-3xl bg-secondary/60 p-4 text-sm text-muted-foreground">
                    <div className="font-semibold text-foreground">Status</div>
                    <p>{travelPackage.is_active ? 'Active' : 'Inactive'}</p>
                  </div>
                </div>

                <div className="mt-8 space-y-4 text-muted-foreground">
                  <h2 className="text-2xl font-semibold">Description</h2>
                  <p className="leading-relaxed">{travelPackage.description}</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[30px] border border-border bg-card p-8 shadow-sm">
                <h2 className="text-2xl font-semibold mb-4">Ask about this package</h2>
                <p className="text-muted-foreground mb-6">
                  Submit an inquiry and we’ll get back to you with custom pricing and availability.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="full_name" className="block text-sm mb-2">Full Name *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        id="full_name"
                        type="text"
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm mb-2">Email Address *</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone_number" className="block text-sm mb-2">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        id="phone_number"
                        type="tel"
                        value={formData.phone_number}
                        onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="number_of_travelers" className="block text-sm mb-2">Number of Travelers</label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        id="number_of_travelers"
                        type="number"
                        min="1"
                        value={formData.number_of_travelers}
                        onChange={(e) => setFormData({ ...formData, number_of_travelers: Number(e.target.value) })}
                        className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="notes" className="block text-sm mb-2">Notes</label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        rows={4}
                        className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-ring text-sm resize-none"
                      />
                    </div>
                  </div>

                  {submitError && (
                    <div className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                      {submitError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitLoading}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    {submitLoading ? 'Sending inquiry...' : 'Submit Inquiry'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
