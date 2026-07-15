import { MapPin, Users, PhilippinePeso } from 'lucide-react';
import { getImageSrc } from '../../../config/api';

export interface TravelPackage {
  id: number;
  title: string;
  description: string;
  base_price: string;
  show_price: boolean;
  number_of_travelers: number;
  destination: string;
  is_active: boolean;
  image_url: string;
}

interface Props {
  package: TravelPackage;
  onViewDetails: (pkg: TravelPackage) => void;
}

export default function TravelPackageCard({ package: pkg, onViewDetails }: Props) {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-xl transition-shadow group flex-shrink-0 w-72">
      <div className="relative h-48 overflow-hidden">
        {pkg.image_url ? (
          <img
            src={getImageSrc(pkg.image_url)}
            alt={pkg.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-sm">
            No image
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="mb-2 line-clamp-1">{pkg.title}</h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span className="line-clamp-1">{pkg.destination}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Users className="w-4 h-4 flex-shrink-0" />
          <span>{pkg.number_of_travelers} travelers</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            {pkg.show_price && (
              <>
                <span className="text-xs text-muted-foreground">From</span>
                <div className="flex items-center gap-1">
                  <PhilippinePeso className="w-4 h-4 text-primary" />
                  <p className="text-xl text-primary">
                    {parseFloat(pkg.base_price).toLocaleString()}
                  </p>
                </div>
              </>
            )}
          </div>
          <button
            onClick={() => onViewDetails(pkg)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity text-sm"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
