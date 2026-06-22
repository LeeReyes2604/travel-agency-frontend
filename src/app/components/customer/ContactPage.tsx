import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageSquare } from 'lucide-react';
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
          <h1 className="text-5xl mb-6 text-[#145889] font-semibold">Contact Us</h1>
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
            <h3 className="text-[#145889] mb-2 font-semibold">Office Address</h3>
            <p className="text-muted-foreground text-sm">
             1st Level One Mall Valenzuela Lower Ground Floor
             Puregold Paso de Blas Valenzuela city, Valenzuela, Philippines
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-chart-2/10 rounded-full mb-4">
              <Phone className="w-7 h-7 text-chart-2" />
            </div>
            <h3 className="text-[#145889] mb-2 font-semibold">Phone Numbers</h3>
            <p className="text-muted-foreground text-sm">               
              0917 134 2516
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-chart-3/10 rounded-full mb-4">
              <Mail className="w-7 h-7 text-chart-3" />
            </div>
            <h3 className="text-[#145889] mb-2 font-semibold">Email Addresses</h3>
            <p className="text-muted-foreground text-sm">
              tripietravelandtours@gmail.com
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-chart-4/10 rounded-full mb-4">
              <Clock className="w-7 h-7 text-chart-4" />
            </div>
            <h3 className="text-[#145889] mb-2 font-semibold">Business Hours</h3>
            <p className="text-muted-foreground text-sm">
              Monday - Sunday<br />
              10:00 AM - 9:00 PM EST<br />
              <br />
              
            </p>
          </div>
        </div>

        {/* Centralized Visit Our Office Section */}
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-6">
            <h2 className="text-3xl mb-3 text-[#145889] font-semibold">Visit Our Office</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              We'd love to meet you in person! Drop by our office or schedule an appointment.
            </p>
          </div>

          {/* Map Placeholder */}
          <div className="bg-card border border-border rounded-lg overflow-hidden shadow-lg mb-6 w-full">
            <div className="relative h-96 bg-accent/20 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  1st Level One Mall Valenzuela Lower Ground Floor  <br />Puregold Paso de Blas Valenzuela city, Valenzuela, Philippines<br />
                  
                </p>
                <a
                  href="https://www.google.com/maps/search/-1st+Level+One+Mall+Valenzuela+Lower+Ground+Floor++-+Puregold+Paso+de+Blas+Valenzuela+city,+Valenzuela,+Philippines/@14.6976777,120.9615436,7496m/data=!3m2!1e3!4b1?entry=ttu&g_ep=EgoyMDI2MDYxNi4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 px-6 py-2 bg-[#145889] text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  Open in Google Maps
                </a>
              </div>
            </div>
          </div>

          {/* FAQ Quick Links */}
          <div className="bg-card border border-border rounded-lg p-6 max-w-md mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <MessageSquare className="w-6 h-6 text-[#145889]" />
              <h3 className="text-[#145889] font-semibold">Quick Help</h3>
            </div>
            <div className="space-y-3">
              <a href="/#inquiry" className="block text-muted-foreground hover:text-[#145889] transition-colors text-sm">
                → Get a travel quote
              </a>
              <a href="/packages" className="block text-muted-foreground hover:text-[#145889] transition-colors text-sm">
                → Browse tour packages
              </a>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}