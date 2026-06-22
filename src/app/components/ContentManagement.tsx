import { useEffect, useState } from 'react';
import { Clock, Edit, Mail, MapPin, Megaphone, Phone, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { API_ENDPOINTS } from '../../config/api';
import { auth } from '../../config/auth';
import NestedFormInput from './NestedFormInput';

interface Meta {
  current_page: number;
  next_page: number | null;
  prev_page: number | null;
  total_pages: number;
  total_count: number;
}

interface Promo {
  id: number;
  title: string;
  details: string;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

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
  created_at?: string;
  updated_at?: string;
}

interface ContactNestedFormLimits {
  phone_numbers?: number;
  emails?: number;
  business_hours?: number;
}

type Tab = 'promos' | 'contacts';

const keyValueColumns = [
  { name: 'key', label: 'Label', type: 'text' as const, placeholder: 'Main' },
  { name: 'value', label: 'Value', type: 'text' as const, required: true, placeholder: 'Value' },
];

const normalizeRows = (rows: Record<string, any>[]) =>
  rows
    .map((row) => ({
      key: String(row.key || '').trim(),
      value: String(row.value || '').trim(),
    }))
    .filter((row) => row.value);

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${auth.getToken()}`,
});

const normalizeContactResponse = (data: any): { contact: Contact; limits: ContactNestedFormLimits } => ({
  contact: data.contact ?? data,
  limits: data.nested_form_limits ?? data.form_limits ?? data.contact?.nested_form_limits ?? {},
});

export default function ContentManagement() {
  const [activeTab, setActiveTab] = useState<Tab>('promos');
  const [promos, setPromos] = useState<Promo[]>([]);
  const [contact, setContact] = useState<Contact | null>(null);
  const [contactFormLimits, setContactFormLimits] = useState<ContactNestedFormLimits>({});
  const [promoMeta, setPromoMeta] = useState<Meta | null>(null);
  const [promoPage, setPromoPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [promoModalOpen, setPromoModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promo | null>(null);

  const [promoFormData, setPromoFormData] = useState<Omit<Promo, 'id'>>({
    title: '',
    details: '',
    active: true,
  });

  const [contactFormData, setContactFormData] = useState<Omit<Contact, 'id'>>({
    address: '',
    google_maps_url: '',
    phone_numbers: [],
    emails: [],
    business_hours: [],
  });

  const fetchPromos = async (page = promoPage) => {
    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.adminPromos(page), {
        headers: { Authorization: `Bearer ${auth.getToken()}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to load promos.');
      setPromos(data.promos || []);
      setPromoMeta(data.meta || null);
    } catch (error: any) {
      toast.error(error?.message || 'Unable to load promos.');
    } finally {
      setLoading(false);
    }
  };

  const fetchContact = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.adminContact, {
        headers: { Authorization: `Bearer ${auth.getToken()}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to load contact.');
      const normalized = normalizeContactResponse(data);
      setContact(normalized.contact);
      setContactFormLimits(normalized.limits);
    } catch (error: any) {
      toast.error(error?.message || 'Unable to load contact.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromos(promoPage);
  }, [promoPage]);

  useEffect(() => {
    fetchContact();
  }, []);

  const openAddPromoModal = () => {
    setEditingPromo(null);
    setPromoFormData({ title: '', details: '', active: true });
    setPromoModalOpen(true);
  };

  const openEditPromoModal = (promo: Promo) => {
    setEditingPromo(promo);
    setPromoFormData({
      title: promo.title,
      details: promo.details,
      active: promo.active,
    });
    setPromoModalOpen(true);
  };

  const openEditContactModal = (contact: Contact) => {
    setContactFormData({
      address: contact.address,
      google_maps_url: contact.google_maps_url || '',
      phone_numbers: contact.phone_numbers || [],
      emails: contact.emails || [],
      business_hours: contact.business_hours || [],
    });
    setContactModalOpen(true);
  };

  const handlePromoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        editingPromo ? API_ENDPOINTS.adminPromo(editingPromo.id) : API_ENDPOINTS.adminPromos(),
        {
          method: editingPromo ? 'PATCH' : 'POST',
          headers: authHeaders(),
          body: JSON.stringify({ promo: promoFormData }),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to save promo.');
      toast.success(editingPromo ? 'Promo updated.' : 'Promo created.');
      setPromoModalOpen(false);
      fetchPromos(promoPage);
    } catch (error: any) {
      toast.error(error?.message || 'Unable to save promo.');
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...contactFormData,
      google_maps_url: contactFormData.google_maps_url || null,
      phone_numbers: normalizeRows(contactFormData.phone_numbers),
      emails: normalizeRows(contactFormData.emails),
      business_hours: normalizeRows(contactFormData.business_hours),
    };

    try {
      const response = await fetch(API_ENDPOINTS.adminContact, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ contact: payload }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to save contact.');
      toast.success('Contact updated.');
      const normalized = normalizeContactResponse(data);
      setContact(normalized.contact);
      setContactFormLimits(normalized.limits);
      setContactModalOpen(false);
    } catch (error: any) {
      toast.error(error?.message || 'Unable to save contact.');
    }
  };

  const deletePromo = async (id: number) => {
    if (!confirm('Are you sure you want to delete this promo?')) return;
    try {
      const response = await fetch(API_ENDPOINTS.adminPromo(id), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${auth.getToken()}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to delete promo.');
      toast.success(data.message || 'Promo deleted.');
      fetchPromos(promoPage);
    } catch (error: any) {
      toast.error(error?.message || 'Unable to delete promo.');
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="mb-2">Content Management</h1>
        <p className="text-muted-foreground">Manage homepage promotions and public contact information</p>
      </div>

      <div className="flex gap-4 mb-6 border-b border-border">
        <button
          onClick={() => setActiveTab('promos')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
            activeTab === 'promos'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Megaphone className="w-5 h-5" />
          <span>Homepage Promos</span>
        </button>
        <button
          onClick={() => setActiveTab('contacts')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
            activeTab === 'contacts'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Phone className="w-5 h-5" />
          <span>Contacts</span>
        </button>
      </div>

      {activeTab === 'promos' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              {promoMeta ? `${promoMeta.total_count} promos` : 'Homepage banner promotions'}
            </p>
            <button
              onClick={openAddPromoModal}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              <Plus className="w-5 h-5" />
              <span>New Promo</span>
            </button>
          </div>

          {loading && promos.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground">Loading promos...</div>
          ) : promos.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground">No promos found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {promos.map((promo) => (
                <div key={promo.id} className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3>{promo.title}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditPromoModal(promo)}
                        className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deletePromo(promo.id)}
                        className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4">{promo.details}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="text-sm text-muted-foreground">Promo #{promo.id}</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        promo.active ? 'bg-chart-4/20 text-chart-4' : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {promo.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {promoMeta && promoMeta.total_pages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={() => setPromoPage(promoMeta.prev_page || 1)}
                disabled={!promoMeta.prev_page}
                className="px-4 py-2 bg-card border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-muted-foreground">
                Page {promoMeta.current_page} of {promoMeta.total_pages}
              </span>
              <button
                onClick={() => setPromoPage(promoMeta.next_page || promoMeta.current_page)}
                disabled={!promoMeta.next_page}
                className="px-4 py-2 bg-card border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'contacts' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">Public contact page information</p>
            {contact && (
              <button
                onClick={() => openEditContactModal(contact)}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                <Edit className="w-5 h-5" />
                <span>Edit Contact</span>
              </button>
            )}
          </div>

          {loading && !contact ? (
            <div className="py-20 text-center text-muted-foreground">Loading contact...</div>
          ) : !contact ? (
            <div className="py-20 text-center text-muted-foreground">No seeded contact found.</div>
          ) : (
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-start gap-2 mb-6">
                <MapPin className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h3>{contact.address}</h3>
                  {contact.google_maps_url && (
                    <a
                      href={contact.google_maps_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      Open Google Maps
                    </a>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ContactList icon={<Phone className="w-4 h-4" />} title="Phone Numbers" items={contact.phone_numbers} />
                <ContactList icon={<Mail className="w-4 h-4" />} title="Emails" items={contact.emails} />
                <ContactList icon={<Clock className="w-4 h-4" />} title="Business Hours" items={contact.business_hours} />
              </div>
            </div>
          )}
        </div>
      )}

      {promoModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-lg max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2>{editingPromo ? 'Edit Promo' : 'New Promo'}</h2>
              <button onClick={() => setPromoModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                x
              </button>
            </div>

            <form onSubmit={handlePromoSubmit} className="space-y-4">
              <div>
                <label htmlFor="promo-title" className="block text-sm mb-2">
                  Title
                </label>
                <input
                  id="promo-title"
                  type="text"
                  value={promoFormData.title}
                  onChange={(e) => setPromoFormData({ ...promoFormData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>

              <div>
                <label htmlFor="promo-details" className="block text-sm mb-2">
                  Details
                </label>
                <textarea
                  id="promo-details"
                  value={promoFormData.details}
                  onChange={(e) => setPromoFormData({ ...promoFormData, details: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  required
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  id="promo-active"
                  type="checkbox"
                  checked={promoFormData.active}
                  onChange={(e) => setPromoFormData({ ...promoFormData, active: e.target.checked })}
                  className="w-5 h-5 rounded border-border"
                />
                <label htmlFor="promo-active" className="text-sm">
                  Active
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setPromoModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                  {editingPromo ? 'Update Promo' : 'Create Promo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {contactModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-lg max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2>Edit Contact</h2>
              <button onClick={() => setContactModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                x
              </button>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div>
                <label htmlFor="contact-address" className="block text-sm mb-2">
                  Address
                </label>
                <textarea
                  id="contact-address"
                  value={contactFormData.address}
                  onChange={(e) => setContactFormData({ ...contactFormData, address: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  required
                />
              </div>

              <div>
                <label htmlFor="contact-google-maps-url" className="block text-sm mb-2">
                  Google Maps URL
                </label>
                <input
                  id="contact-google-maps-url"
                  type="url"
                  value={contactFormData.google_maps_url || ''}
                  onChange={(e) => setContactFormData({ ...contactFormData, google_maps_url: e.target.value })}
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="https://maps.google.com/..."
                />
              </div>

              <NestedFormInput
                label="Phone Numbers"
                columns={keyValueColumns}
                value={contactFormData.phone_numbers}
                minRows={0}
                maxRows={contactFormLimits.phone_numbers}
                addButtonLabel="Add Phone Number"
                onChange={(phone_numbers) => setContactFormData({ ...contactFormData, phone_numbers: phone_numbers as KeyValueItem[] })}
              />

              <NestedFormInput
                label="Emails"
                columns={[
                  keyValueColumns[0],
                  { ...keyValueColumns[1], type: 'email' as const, placeholder: 'info@example.com' },
                ]}
                value={contactFormData.emails}
                minRows={0}
                maxRows={contactFormLimits.emails}
                addButtonLabel="Add Email"
                onChange={(emails) => setContactFormData({ ...contactFormData, emails: emails as KeyValueItem[] })}
              />

              <NestedFormInput
                label="Business Hours"
                columns={[
                  { ...keyValueColumns[0], placeholder: 'Monday-Friday' },
                  { ...keyValueColumns[1], placeholder: '9:00 AM - 6:00 PM' },
                ]}
                value={contactFormData.business_hours}
                minRows={0}
                maxRows={contactFormLimits.business_hours}
                addButtonLabel="Add Business Hours"
                onChange={(business_hours) => setContactFormData({ ...contactFormData, business_hours: business_hours as KeyValueItem[] })}
              />

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setContactModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                  Update Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function ContactList({
  icon,
  title,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  items: KeyValueItem[];
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3 text-muted-foreground">
        {icon}
        <p className="text-sm">{title}</p>
      </div>
      <div className="space-y-2">
        {items?.length ? (
          items.map((item, index) => (
            <p key={`${item.key}-${item.value}-${index}`} className="text-sm">
              {item.key ? <span className="text-muted-foreground">{item.key}: </span> : null}
              {item.value}
            </p>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No entries</p>
        )}
      </div>
    </div>
  );
}
