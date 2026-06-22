import { useEffect, useState } from 'react';
import { Clock, Mail, MapPin, MessageSquare, Phone } from 'lucide-react';
import { API_ENDPOINTS } from '../../../config/api';

interface KeyValueItem {
  key?: string;
  value: string;
}

interface Contact {
  id: number;
  address: string;
  google_maps_url: string | null;
  phone_numbers: KeyValueItem[];
  emails: KeyValueItem[];
  business_hours: KeyValueItem[];
}

const formatItem = (item: KeyValueItem) => (item.key ? `${item.key}: ${item.value}` : item.value);

export default function ContactPage() {
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchContact = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(API_ENDPOINTS.clientContact);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Unable to load contact information.');
        setContact(data.contact ?? data);
      } catch (err: any) {
        setError(err?.message || 'Unable to load contact information.');
      } finally {
        setLoading(false);
      }
    };

    fetchContact();
  }, []);

  const hasBusinessHours = Boolean(contact?.business_hours?.length);

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-br from-primary/10 to-accent/20 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl mb-6">Contact Us</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Have questions? We're here to help! Reach out to our friendly team and we'll respond as soon as possible.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {error && (
          <div className="mb-8 bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-20 text-center text-muted-foreground">Loading contact information...</div>
        ) : contact ? (
          <>
            <div
              className={`grid grid-cols-1 md:grid-cols-2 ${
                hasBusinessHours ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
              } gap-6 mb-16`}
            >
              <ContactCard
                icon={<MapPin className="w-7 h-7 text-chart-1" />}
                iconClassName="bg-chart-1/10"
                title="Office Address"
                lines={[contact.address]}
              />
              <ContactCard
                icon={<Phone className="w-7 h-7 text-chart-2" />}
                iconClassName="bg-chart-2/10"
                title="Phone Numbers"
                lines={contact.phone_numbers?.map(formatItem) || []}
              />
              <ContactCard
                icon={<Mail className="w-7 h-7 text-chart-3" />}
                iconClassName="bg-chart-3/10"
                title="Email Addresses"
                lines={contact.emails?.map(formatItem) || []}
              />
              {hasBusinessHours && (
                <ContactCard
                  icon={<Clock className="w-7 h-7 text-chart-4" />}
                  iconClassName="bg-chart-4/10"
                  title="Business Hours"
                  lines={contact.business_hours.map(formatItem)}
                />
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <div className="mb-6">
                  <h2 className="text-3xl mb-3">Visit Our Office</h2>
                  <p className="text-muted-foreground">
                    We'd love to meet you in person! Drop by our office or open the map for directions.
                  </p>
                </div>

                <div className="bg-card border border-border rounded-lg overflow-hidden shadow-lg mb-6">
                  {contact.google_maps_url ? (
                    <iframe
                      src={contact.google_maps_url}
                      title="Office location on Google Maps"
                      className="w-full h-96 border-0"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      allowFullScreen
                    />
                  ) : (
                    <div className="relative h-96 bg-accent/20 flex items-center justify-center p-8">
                      <div className="text-center">
                        <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground whitespace-pre-line">{contact.address}</p>
                      </div>
                    </div>
                  )}
                </div>

                {contact.google_maps_url && (
                  <a
                    href={contact.google_maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Open in Google Maps
                  </a>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="py-20 text-center text-muted-foreground">No contact information available.</div>
        )}
      </div>
    </div>
  );
}

function ContactCard({
  icon,
  iconClassName,
  title,
  lines,
}: {
  icon: React.ReactNode;
  iconClassName: string;
  title: string;
  lines: string[];
}) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
      <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full mb-4 ${iconClassName}`}>
        {icon}
      </div>
      <h3 className="mb-2">{title}</h3>
      <div className="text-muted-foreground text-sm space-y-1">
        {lines.length ? (
          lines.map((line, index) => (
            <p key={`${line}-${index}`} className="whitespace-pre-line">
              {line}
            </p>
          ))
        ) : (
          <p>Not available</p>
        )}
      </div>
    </div>
  );
}
