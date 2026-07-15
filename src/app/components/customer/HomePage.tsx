import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { MapPin, Star, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import InquiryForm from './InquiryForm';
import TravelPackageCard from './TravelPackageCard';
import { useTravelPackages } from '../../hooks/useTravelPackages';
import { API_ENDPOINTS } from '../../../config/api';
import { createHeadersNoAuth } from '../../../config/header';

interface Promo {
  id: number;
  title: string;
  details: string;
  active: boolean;
}

export default function HomePage() {
  const navigate = useNavigate();
  const { packages, loading, error } = useTravelPackages(1);
  const [promos, setPromos] = useState<Promo[]>([]);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPromos = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.clientPromos(), {
          headers: createHeadersNoAuth(), // or true depending on your logic
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to load promos');
        setPromos(data.promos || []);
      } catch (error) {
        setPromos([]);
      }
    };

    fetchPromos();
  }, []);

  const scrollLeft = () => {
    sliderRef.current?.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    sliderRef.current?.scrollBy({ left: 300, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[600px] bg-gradient-to-br from-primary/90 to-primary/70">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage:
              'url(https://cdn.corenexis.com/f/2DyzVy6dPTl.jpg)',
          }}
        />
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="max-w-4xl">
            <h1
              className="font-brunson font-normal text-6xl md:text-7xl text-[#ffcc00] mb-6"
              style={{ textShadow: "0 4px 10px rgba(0, 0, 0, 0.6)" }}
            >
              Your Dream Vacation Starts Here
            </h1>
            <p className="font-poppins font-semibold text-xl md:text-2xl text-primary-foreground/90 mb-8"  style={{ textShadow: "0 4px 10px rgba(0, 0, 0, 0.6)" }}>
              Discover unforgettable destinations with Tripie Travel & Tours
            </p>
            <a
              href="#inquiry"
              className="font-poppins inline-block px-8 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-lg shadow-md"
              style={{ textShadow: "0 4px 10px rgba(0, 0, 0, 0.6)" }}
            >
              Get Your Free Quote
            </a>
          </div>
        </div>
      </div>

      {promos.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {promos.map((promo) => (
            <div
              key={promo.id}
              className="p-6 rounded-lg shadow-lg"
              style={{ backgroundColor: "#ffcc00", boxShadow: "0 8px 20px rgba(0, 0, 0, 0.5)", }}
            >
              <h3
                className="font-brunson text-3xl text-center font-bold mb-2 leading-tight tracking-wide"
                style={{ color: "#08558d" }}
              >
                {promo.title}
              </h3>
              <p
                className="font-poppins text-base font-medium"
                style={{ color: "#08558d" }}
              >
                {promo.details}
              </p>
            </div>
          ))}
        </div>
      </div>
      )}

      {/* Travel Packages Swiper */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="font-brunson text-4xl mb-4 text-[#145889]">Tour Packages</h2>
            <p className="font-poppins text-xl text-muted-foreground">
              Explore our most popular travel packages curated just for you
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={scrollLeft}
              className="p-2 rounded-lg border border-border hover:bg-secondary transition-colors text-[#145889]"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={scrollRight}
              className="p-2 rounded-lg border border-border hover:bg-secondary transition-colors text-[#145889]"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            Loading packages...
          </div>
        ) : packages.length === 0 ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            No packages available at the moment.
          </div>
        ) : (
          <div
            ref={sliderRef}
            className="flex gap-6 overflow-x-auto pb-4 scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {packages.map((pkg) => (
              <TravelPackageCard
                key={pkg.id}
                package={pkg}
                onViewDetails={() => navigate(`/packages/${pkg.id}`)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Inquiry Form Section */}
      <div id="inquiry" className="py-16"style={{ backgroundColor: "#ffcc00" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="font-poppins font-black text-4xl mb-4 text-[#145889]">Plan Your Perfect Trip</h2>
            <p className="font-poppins text-lg text-[#145889]/80">
              Fill out our quick inquiry form and let us create a personalized travel experience for you
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-[#145889] text-[#145889] p-8 md:p-10 rounded-xl border border-border shadow-xl">
            <InquiryForm />
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="font-poppins font-black text-4xl mb-4 text-[#145889]">Why Choose Tripie Travel & Tours?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-chart-1/10 rounded-full mb-4">
              <Star className="w-8 h-8 text-chart-1" />
            </div>
            <h3 className="text-[#145889] mb-3 font-medium">Expert Travel Planners</h3>
            <p className="text-muted-foreground">
              Our experienced team has been creating unforgettable journeys for over 10 years
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-chart-2/10 rounded-full mb-4">
              <TrendingUp className="w-8 h-8 text-chart-2" />
            </div>
            <h3 className="text-[#145889] mb-3 font-medium">Best Price Guarantee</h3>
            <p className="text-muted-foreground">
              We offer competitive prices and exclusive deals you won't find anywhere else
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-chart-4/10 rounded-full mb-4">
              <MapPin className="w-8 h-8 text-chart-4" />
            </div>
            <h3 className="text-[#145889] mb-3 font-medium">24/7 Support</h3>
            <p className="text-muted-foreground">
              Our support team is always available to assist you before, during, and after your trip
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
