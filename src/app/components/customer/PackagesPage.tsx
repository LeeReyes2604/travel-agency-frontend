import { useNavigate } from 'react-router';
import { useTravelPackages } from '../../hooks/useTravelPackages';
import TravelPackageCard from './TravelPackageCard';

export default function PackagesPage() {
  const navigate = useNavigate();
  const { packages, loading, error } = useTravelPackages(1);

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary/10 to-accent/20 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-brunson text-5xl font-semibold mb-4 text-[#145889] tracking-wide">Tour Packages</h1>
          <p className="font-poppins text-lg text-[#145889] max-w-3xl mx-auto">
           Browse our available travel packages and choose the one that matches your next adventure.
           Send us an inquiry, and we'll help you plan your perfect trip.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {error ? (
          <div className="rounded-3xl border border-destructive/20 bg-destructive/10 p-6 text-destructive mb-10">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            Loading packages...
          </div>
        ) : packages.length === 0 ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            No packages available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-8">
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
    </div>
  );
}