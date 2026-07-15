import { useState } from 'react';
import { Mail, Facebook, Instagram } from 'lucide-react';
import { toast } from 'sonner';
import { API_ENDPOINTS } from '../../../config/api';
import { createHeadersNoAuth } from '../../../config/header';

export default function Footer() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.createSubscriber, {
        method: 'POST',
        headers: createHeadersNoAuth(),
        body: JSON.stringify({
          email,
          ...(name.trim() ? { name: name.trim() } : {}),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const message = data?.error || data?.errors?.[0] || 'Unable to subscribe. Please check your input.';
        toast.error(message);
        return;
      }

      toast.success('Thanks for subscribing!');
      setName('');
      setEmail('');
    } catch (error) {
      toast.error('The subscription request failed. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-[#145889] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* --- UPDATED BRAND SECTION --- */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="https://cdn.corenexis.com/f/DurqoCE1E5t.png" 
                alt="Tripie Travel & Tours Logo" 
                className="h-20 w-auto object-contain" 
              />
              <span className="font-brunson text-xl tracking-wide">Tripie Travel & Tours</span>
            </div>
            <p className="text-white/80 mb-4">
              Your trusted partner for unforgettable travel experiences around the world.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/tripietravelandtours/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/tripietravelandtours/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.tiktok.com/@tripietravelandtours"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center justify-center"
                aria-label="TikTok"
              >
                {/* --- UPDATED TIKTOK SVG ICON --- */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5v3a3 3 0 0 1-3-3v7a6 6 0 1 1-6-6v3a3 3 0 0 0 3 3z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-white/80">
              <li>
                <a href="/packages" className="hover:text-white transition-colors">
                  Tour Packages
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="mb-4 font-semibold">Subscribe to Our Newsletter</h3>
            <p className="text-white/80 mb-4 text-sm">
              Get exclusive travel deals and updates delivered to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div>
                <label htmlFor="subscriber-name" className="sr-only">
                  Name (optional)
                </label>
                <input
                  id="subscriber-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name (optional)"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
              </div>
              <div>
                <label htmlFor="subscriber-email" className="sr-only">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
                  <input
                    id="subscriber-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-3 bg-white text-[#145889] font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Subscribing…' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-white/20 text-center text-sm text-white/60">
          <p>&copy; {new Date().getFullYear()} Tripie Travel & Tours. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}