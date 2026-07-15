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

export default function TravelPackageCard({
  package: pkg,
  onViewDetails,
}: Props) {
  return (
    <div
       className="bg-card border border-border rounded-xl overflow-hidden group flex-shrink-0 w-[36rem] transition-all duration-300 hover:-translate-y-1"      style={{
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.35)",
      }}
    >    
  {/* Package Image */}
      <div className="relative h-48 overflow-hidden">
        {pkg.image_url ? (
          <img
            src={getImageSrc(pkg.image_url)}
            alt={pkg.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-sm">
            No Image Available
          </div>
        )}
      </div>

      {/* Package Information */}
      <div className="p-4 bg-[#ffcc00]">
        <h3 className="mb-2 text-xl font-bold text-[#08558d] line-clamp-1">
          {pkg.title}
        </h3>

        <div className="flex items-center gap-2 text-sm text-[#08558d] mb-2">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span className="line-clamp-1">{pkg.destination}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-[#08558d] mb-4">
          <Users className="w-4 h-4 flex-shrink-0" />
          <span>{pkg.number_of_travelers} Travelers</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            {pkg.show_price && (
              <>
                <span className="text-xs uppercase tracking-wide text-[#08558d]/80">
                  Starting From
                </span>

                <div className="flex items-center gap-1 mt-1">
                  <PhilippinePeso className="w-4 h-4 text-[#08558d]" />
                  <p className="text-xl font-bold text-[#08558d]">
                    {parseFloat(pkg.base_price).toLocaleString()}
                  </p>
                </div>
              </>
            )}
          </div>

          <button
            onClick={() => onViewDetails(pkg)}
            className="px-4 py-2 bg-[#08558d] text-white rounded-lg hover:bg-[#06456f] transition-colors duration-300 text-sm font-semibold shadow-md"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}