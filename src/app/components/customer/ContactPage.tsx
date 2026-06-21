import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent successfully! We\'ll get back to you within 24 hours.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 to-accent/20 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl mb-6">Contact Us</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Have questions? We're here to help! Reach out to our friendly team and we'll respond as soon as possible.
          </p>
        </div>
      </div>

      {/* Contact Information Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-card border border-border rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-chart-1/10 rounded-full mb-4">
              <MapPin className="w-7 h-7 text-chart-1" />
            </div>
            <h3 className="mb-2">Office Address</h3>
            <p className="text-muted-foreground text-sm">
              123 Travel Street<br />
              Suite 456<br />
              New York, NY 10001<br />
              United States
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-chart-2/10 rounded-full mb-4">
              <Phone className="w-7 h-7 text-chart-2" />
            </div>
            <h3 className="mb-2">Phone Numbers</h3>
            <p className="text-muted-foreground text-sm">
              Main: +1 (555) 123-4567<br />
              Toll Free: 1-800-TRIPIE<br />
              Emergency: +1 (555) 999-0000
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-chart-3/10 rounded-full mb-4">
              <Mail className="w-7 h-7 text-chart-3" />
            </div>
            <h3 className="mb-2">Email Addresses</h3>
            <p className="text-muted-foreground text-sm">
              General: info@tripietravel.com<br />
              Sales: sales@tripietravel.com<br />
              Support: support@tripietravel.com
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-chart-4/10 rounded-full mb-4">
              <Clock className="w-7 h-7 text-chart-4" />
            </div>
            <h3 className="mb-2">Business Hours</h3>
            <p className="text-muted-foreground text-sm">
              Monday - Friday<br />
              9:00 AM - 6:00 PM EST<br />
              <br />
              24/7 Emergency Support
            </p>
          </div>
        </div>

        {/* Contact Form and Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <div className="mb-6">
              <h2 className="text-3xl mb-3">Send Us a Message</h2>
              <p className="text-muted-foreground">
                Fill out the form below and our team will get back to you within 24 hours.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 shadow-lg">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm mb-2">
                    Full Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm mb-2">
                      Email Address *
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
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm mb-2">
                    Subject *
                  </label>
                  <input
                    id="subject"
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="What is this regarding?"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                    placeholder="How can we help you?"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                  <Send className="w-5 h-5" />
                  <span>Send Message</span>
                </button>
              </form>
            </div>
          </div>

          {/* Map and Additional Info */}
          <div>
            <div className="mb-6">
              <h2 className="text-3xl mb-3">Visit Our Office</h2>
              <p className="text-muted-foreground">
                We'd love to meet you in person! Drop by our office or schedule an appointment.
              </p>
            </div>

            {/* Map Placeholder */}
            <div className="bg-card border border-border rounded-lg overflow-hidden shadow-lg mb-6">
              <div className="relative h-96 bg-accent/20 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    123 Travel Street, Suite 456<br />
                    New York, NY 10001
                  </p>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Open in Google Maps
                  </a>
                </div>
              </div>
            </div>

            {/* FAQ Quick Links */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <MessageSquare className="w-6 h-6 text-primary" />
                <h3>Quick Help</h3>
              </div>
              <div className="space-y-3">
                <a href="/#inquiry" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                  → Get a travel quote
                </a>
                <a href="/packages" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                  → Browse tour packages
                </a>
                <a href="/partnership" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                  → Partnership opportunities
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Contact Banner */}
      <div className="bg-destructive/10 border-t border-b border-destructive/20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="mb-2 text-destructive">Emergency Travel Assistance</h3>
          <p className="text-muted-foreground mb-4">
            If you're currently traveling and need urgent assistance, our 24/7 emergency line is available.
          </p>
          <a
            href="tel:+15559990000"
            className="inline-flex items-center gap-2 px-6 py-3 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            <Phone className="w-5 h-5" />
            <span>Call Emergency Line: +1 (555) 999-0000</span>
          </a>
        </div>
      </div>
    </div>
  );
}
