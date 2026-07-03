import { useState } from 'react';
import { MapPin, Users, PhilippinePeso, User, Mail, Phone, MessageSquare, Send, ArrowLeft, LucidePhilippinePeso } from 'lucide-react';
import { toast } from 'sonner';
import { TravelPackage } from './TravelPackageCard';
import { API_ENDPOINTS, getImageSrc } from '../../../config/api';
import { createHeadersNoAuth } from '../../../config/header';

interface Props {
  package: TravelPackage;
  onClose: () => void;
}

const defaultForm = {
  full_name: '',
  email: '',
  phone_number: '',
  number_of_travelers: 1,
  notes: '',
};

export default function TravelPackageModal({ package: pkg, onClose }: Props) {
  const [step, setStep] = useState<'detail' | 'inquiry'>('detail');
  const [formData, setFormData] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInquire = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(API_ENDPOINTS.clientTravelPackageInquire(pkg.id), {
        method: 'POST',
        headers: createHeadersNoAuth(),
        body: JSON.stringify({ inquiry: formData }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');

      toast.success("Your inquiry has been submitted! We'll contact you within 24 hours.");
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">

        {step === 'detail' ? (
          <>
            {/* Package Detail */}
            <div className="relative h-72 overflow-hidden rounded-t-lg">
              {pkg.image_url ? (
                <img
                  src={getImageSrc(pkg.image_url)}
                  alt={pkg.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                  No image
                </div>
              )}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full p-2 text-foreground"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              <h2 className="mb-2">{pkg.title}</h2>

              <div className="flex flex-wrap gap-4 text-muted-foreground mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{pkg.destination}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4" />
                  <span>{pkg.number_of_travelers} travelers</span>
                </div>
                {pkg.show_price && (
                  <div className="flex items-center gap-2 text-sm">
                    <PhilippinePeso className="w-4 h-4" />
                    <span>₱{parseFloat(pkg.base_price).toLocaleString()}</span>
                  </div>
                )}
              </div>

              <p className="text-muted-foreground text-sm mb-6">{pkg.description}</p>

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                  Close
                </button>
                <button
                  onClick={() => setStep('inquiry')}
                  className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                  Book This Package
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Inquiry Form */}
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={() => setStep('detail')}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h2>Book This Package</h2>
                  <p className="text-sm text-muted-foreground">{pkg.title} — {pkg.destination}</p>
                </div>
              </div>

              <form onSubmit={handleInquire} className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Juan Dela Cruz"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="juan@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="tel"
                      value={formData.phone_number}
                      onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="+63 912 345 6789"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2">Number of Travelers</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="number"
                      min="1"
                      value={formData.number_of_travelers}
                      onChange={(e) => setFormData({ ...formData, number_of_travelers: Number(e.target.value) })}
                      className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2">
                    <MessageSquare className="inline w-4 h-4 mr-1" />
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                    placeholder="Any special requests or questions..."
                  />
                </div>

                {error && (
                  <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep('detail')}
                    className="flex-1 px-4 py-3 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                    {loading ? 'Submitting...' : 'Submit Inquiry'}
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}