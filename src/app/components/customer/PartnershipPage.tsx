import { useState } from 'react';
import { Building2, Hotel, Code, Handshake, TrendingUp, Users, Send } from 'lucide-react';
import { toast } from 'sonner';

export default function PartnershipPage() {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    partnershipType: 'Hotel',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Thank you for your partnership inquiry! We\'ll contact you within 2 business days.');
    setFormData({
      companyName: '',
      contactName: '',
      email: '',
      phone: '',
      partnershipType: 'Hotel',
      message: '',
    });
  };

  const partnershipTypes = [
    {
      icon: Hotel,
      title: 'Hotel & Resort Partners',
      description: 'Join our network of premium accommodations and reach travelers worldwide.',
      benefits: ['Increased bookings', 'Marketing exposure', 'Revenue sharing model', 'Global distribution'],
    },
    {
      icon: Building2,
      title: 'Business Collaborations',
      description: 'Corporate partnerships for employee travel programs and business travel solutions.',
      benefits: ['Dedicated account manager', 'Volume discounts', 'Customized packages', 'Flexible payment terms'],
    },
    {
      icon: Code,
      title: 'Technology Partners',
      description: 'IT teams and tech companies interested in building travel solutions together.',
      benefits: ['API integration', 'White-label solutions', 'Co-development opportunities', 'Technical support'],
    },
    {
      icon: Handshake,
      title: 'Tour Operators',
      description: 'Local tour operators looking to expand their reach through our platform.',
      benefits: ['Commission structure', 'Marketing support', 'Booking management tools', 'Customer reviews'],
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 to-accent/20 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl mb-6">Partnership Opportunities</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Grow your business with Tripie Travel & Tours. We're always looking for great partners to enhance our travelers' experiences.
          </p>
        </div>
      </div>

      {/* Partnership Types */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl mb-4">Partnership Programs</h2>
          <p className="text-xl text-muted-foreground">
            Choose the partnership model that fits your business best
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {partnershipTypes.map((type, index) => (
            <div key={index} className="bg-card border border-border rounded-lg p-8 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <type.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl">{type.title}</h3>
              </div>
              <p className="text-muted-foreground mb-6">{type.description}</p>
              <div className="space-y-2">
                <p className="text-sm font-medium">Benefits:</p>
                <ul className="space-y-2">
                  {type.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Why Partner With Us */}
      <div className="bg-accent/30 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl mb-4">Why Partner With Us?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-chart-1/10 rounded-full mb-4">
                <Users className="w-8 h-8 text-chart-1" />
              </div>
              <h3 className="mb-3">15,000+ Active Customers</h3>
              <p className="text-muted-foreground">
                Access our extensive customer base actively seeking travel experiences
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-chart-2/10 rounded-full mb-4">
                <TrendingUp className="w-8 h-8 text-chart-2" />
              </div>
              <h3 className="mb-3">10+ Years Experience</h3>
              <p className="text-muted-foreground">
                Benefit from our decade of expertise in the travel industry
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-chart-4/10 rounded-full mb-4">
                <Handshake className="w-8 h-8 text-chart-4" />
              </div>
              <h3 className="mb-3">Trusted Brand</h3>
              <p className="text-muted-foreground">
                Partner with a recognized name that customers trust for quality travel
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Partnership Inquiry Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl mb-4">Start Your Partnership Journey</h2>
          <p className="text-xl text-muted-foreground">
            Fill out the form below and our partnership team will get in touch with you
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-8 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="companyName" className="block text-sm mb-2">
                  Company/Organization Name *
                </label>
                <input
                  id="companyName"
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
              <div>
                <label htmlFor="contactName" className="block text-sm mb-2">
                  Contact Person Name *
                </label>
                <input
                  id="contactName"
                  type="text"
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="email" className="block text-sm mb-2">
                  Business Email *
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm mb-2">
                  Phone Number *
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="partnershipType" className="block text-sm mb-2">
                Partnership Type *
              </label>
              <select
                id="partnershipType"
                value={formData.partnershipType}
                onChange={(e) => setFormData({ ...formData, partnershipType: e.target.value })}
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                required
              >
                <option value="Hotel">Hotel & Resort Partnership</option>
                <option value="Business">Business Collaboration</option>
                <option value="Technology">Technology Partnership</option>
                <option value="Tour">Tour Operator Partnership</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm mb-2">
                Tell Us About Your Partnership Interest *
              </label>
              <textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={6}
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                placeholder="Please describe your company, what type of partnership you're interested in, and any specific questions you have..."
                required
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              <Send className="w-5 h-5" />
              <span>Submit Partnership Inquiry</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
