import { NavLink } from 'react-router';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import tripieLogo from '../../../assets/images/tripie-logo.png';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Tour Packages', path: '/packages' },
    { label: 'About Us', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <header className="bg-[#145889] border-b border-white/10 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-24">
          
          {/* --- UPDATED LOGO & TEXT SECTION --- */}
          <NavLink to="/" className="flex items-center gap-2 sm:gap-3 min-w-0 transition-opacity hover:opacity-80"  style={{ textShadow: "0 0 10px rgba(0, 0, 0, 0.6)" }}>
            <img 
              src={tripieLogo}
              alt="Tripie Travel & Tours Logo" 
              className="h-16 sm:h-20 md:h-24 w-auto object-contain flex-shrink-0" 
            />
           <span className="font-brunson text-lg xs:text-xl sm:text-2xl md:text-3xl text-white tracking-wide truncate"> Tripie Travel & Tours </span>
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                className={({ isActive }) =>
                  `font-brunson tracking-widest transition-all duration-300 ${isActive 
                    ? 'text-white text-shadow' 
                    : 'text-white/80 hover:text-white hover:text-shadow'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-white/10">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === '/'}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg transition-colors ${isActive
                      ? 'bg-white/20 text-white font-semibold'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}