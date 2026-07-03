import { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Users, DollarSign, MessageSquare, Send } from 'lucide-react';
import { toast } from 'sonner';
import { API_ENDPOINTS } from '../../../config/api';
import { createHeadersNoAuth } from '../../../config/header';

const defaultForm = {
  full_name: '',
  email: '',
  phone_number: '',
  destination: '',
  departure_date: '',
  return_date: '',
  number_of_travelers: 1,
  estimated_budget: '',
  notes: '',
};

export default function InquiryForm() {
  const [formData, setFormData] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(API_ENDPOINTS.inquiries, {
        method: 'POST',
        headers: createHeadersNoAuth(),
        body: JSON.stringify({
          inquiry: {
            full_name: formData.full_name,
            email: formData.email,
            phone_number: formData.phone_number || null,
            destination: formData.destination || null,
            departure_date: formData.departure_date || null,
            return_date: formData.return_date || null,
            number_of_travelers: formData.number_of_travelers,
            estimated_budget: formData.estimated_budget || null,
            notes: formData.notes || null,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');

      toast.success("Your inquiry has been submitted! We'll contact you within 24 hours.");
      setFormData(defaultForm);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-lg">
      <div className="mb-6">
        <h3 className="mb-2">Get Your Free Travel Quote</h3>
        <p className="text-muted-foreground text-sm">
          Fill out the form below and our travel experts will get back to you with a personalized quote.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="full_name" className="block text-sm mb-2">Full Name *</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                id="full_name"
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                placeholder="Juan Dela Cruz"
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
                className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                placeholder="juan@example.com"
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
                className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                placeholder="09XXXXXXXXX"
              />
            </div>
          </div>
        </div>

        {/* Destination */}
        <div>
          <label htmlFor="destination" className="block text-sm mb-2">Destination</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              id="destination"
              type="text"
              value={formData.destination}
              onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              placeholder="Batanes, Philippines"
            />
          </div>
        </div>

        {/* Travel Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="departure_date" className="block text-sm mb-2">Departure Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                id="departure_date"
                type="date"
                value={formData.departure_date}
                onChange={(e) => setFormData({ ...formData, departure_date: e.target.value })}
                className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="return_date" className="block text-sm mb-2">Return Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                id="return_date"
                type="date"
                value={formData.return_date}
                onChange={(e) => setFormData({ ...formData, return_date: e.target.value })}
                className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              />
            </div>
          </div>
        </div>

        {/* Number of Travelers */}
        <div>
          <label htmlFor="number_of_travelers" className="block text-sm mb-2">
            <Users className="inline w-4 h-4 mr-1" />
            Number of Travelers
          </label>
          <input
            id="number_of_travelers"
            type="number"
            min="1"
            value={formData.number_of_travelers}
            onChange={(e) => setFormData({ ...formData, number_of_travelers: Number(e.target.value) })}
            className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
          />
        </div>

        {/* Estimated Budget */}
        <div>
          <label htmlFor="estimated_budget" className="block text-sm mb-2">Estimated Budget (₱)</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              id="estimated_budget"
              type="number"
              min="0"
              value={formData.estimated_budget}
              onChange={(e) => setFormData({ ...formData, estimated_budget: e.target.value })}
              className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              placeholder="50000"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm mb-2">
            <MessageSquare className="inline w-4 h-4 mr-1" />
            Special Requests or Notes
          </label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none text-sm"
            placeholder="Tell us about any special requirements, hotel preferences, or specific activities you'd like to include..."
          />
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
          <span>{loading ? 'Submitting...' : 'Submit Inquiry'}</span>
        </button>
      </form>
    </div>
  );
}