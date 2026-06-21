import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { MapPin, Star, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import InquiryForm from './InquiryForm';
import TravelPackageCard, { TravelPackage } from './TravelPackageCard';
import { useTravelPackages } from '../../hooks/useTravelPackages';

const promos = [
  {
    id: 1,
    title: 'Summer Sale - Save 20%',
    description: 'Book any international package before June 30th!',
    bgColor: 'bg-gradient-to-r from-chart-1/20 to-chart-2/20',
  },
  {
    id: 2,
    title: 'Early Bird Special',
    description: 'Reserve your 2027 trip now and get exclusive pricing.',
    bgColor: 'bg-gradient-to-r from-chart-3/20 to-chart-4/20',
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { packages, loading, error } = useTravelPackages(1);
  const sliderRef = useRef<HTMLDivElement>(null);

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
              'url(https://images.unsplash.com/photo-1535262412227-85541e910204?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHx0cm9waWNhbCUyMGJlYWNoJTIwcGFyYWRpc2UlMjB2YWNhdGlvbnxlbnwxfHx8fDE3Nzk1MzM5MTF8MA&ixlib=rb-4.1.0&q=80&w=1080)',
          }}
        />
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl text-primary-foreground mb-6">
              Your Dream Vacation Starts Here
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8">
              Discover unforgettable destinations with Tripie Travel & Tours
            </p>
            <a
              href="#inquiry"
              className="inline-block px-8 py-4 bg-primary-foreground text-primary rounded-lg hover:opacity-90 transition-opacity text-lg"
            >
              Get Your Free Quote
            </a>
          </div>
        </div>
      </div>

      {/* Promo Banners */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {promos.map((promo) => (
            <div key={promo.id} className={`${promo.bgColor} p-6 rounded-lg border border-border shadow-lg`}>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="mb-2">{promo.title}</h3>
                  <p className="text-muted-foreground">{promo.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Travel Packages Swiper */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl mb-4">Tour Packages</h2>
            <p className="text-xl text-muted-foreground">
              Explore our most popular travel packages curated just for you
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={scrollLeft}
              className="p-2 rounded-lg border border-border hover:bg-secondary transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={scrollRight}
              className="p-2 rounded-lg border border-border hover:bg-secondary transition-colors"
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
      <div id="inquiry" className="bg-accent/30 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-4xl mb-4">Plan Your Perfect Trip</h2>
            <p className="text-xl text-muted-foreground">
              Fill out our quick inquiry form and let us create a personalized travel experience for you
            </p>
          </div>
          <InquiryForm />
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl mb-4">Why Choose Tripie Travel & Tours?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-chart-1/10 rounded-full mb-4">
              <Star className="w-8 h-8 text-chart-1" />
            </div>
            <h3 className="mb-3">Expert Travel Planners</h3>
            <p className="text-muted-foreground">
              Our experienced team has been creating unforgettable journeys for over 10 years
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-chart-2/10 rounded-full mb-4">
              <TrendingUp className="w-8 h-8 text-chart-2" />
            </div>
            <h3 className="mb-3">Best Price Guarantee</h3>
            <p className="text-muted-foreground">
              We offer competitive prices and exclusive deals you won't find anywhere else
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-chart-4/10 rounded-full mb-4">
              <MapPin className="w-8 h-8 text-chart-4" />
            </div>
            <h3 className="mb-3">24/7 Support</h3>
            <p className="text-muted-foreground">
              Our support team is always available to assist you before, during, and after your trip
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}