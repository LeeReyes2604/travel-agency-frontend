const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL || "ws://localhost:3000";

export const WS_ENDPOINT = `${WS_BASE_URL}/cable`;
export const API_ENDPOINTS = {
  login: `${API_BASE_URL}/api/v1/admin/auth/sessions`,
  travelPackages: `${API_BASE_URL}/api/v1/admin/travel_packages`,
  travelPackage: (id: number) => `${API_BASE_URL}/api/v1/admin/travel_packages/${id}`,
  adminInquiries: `${API_BASE_URL}/api/v1/admin/inquiries`,
  adminInquiry: (id: number) => `${API_BASE_URL}/api/v1/admin/inquiries/${id}`,
  inquiries: `${API_BASE_URL}/api/v1/inquiries`,
  clientTravelPackages: `${API_BASE_URL}/api/v1/travel_packages`,
  clientTravelPackage: (id: number) => `${API_BASE_URL}/api/v1/travel_packages/${id}`,
  clientTravelPackageInquire: (id: number) => `${API_BASE_URL}/api/v1/travel_packages/${id}/inquire`,
  createSubscriber: `${API_BASE_URL}/api/v1/subscribers`,
  unsubscribeSubscriber: (token: string) => `${API_BASE_URL}/api/v1/subscribers/unsubscribe/${token}`,
  adminSubscribers: (page = 1) => `${API_BASE_URL}/api/v1/admin/subscribers?page=${page}`,
  adminSubscriber: (id: number) => `${API_BASE_URL}/api/v1/admin/subscribers/${id}`,
  adminSubscribersExport: () => `${API_BASE_URL}/api/v1/admin/subscribers/export`,
  adminAnalytics: () => `${API_BASE_URL}/api/v1/admin/analytics`,
};

export const getImageSrc = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${API_BASE_URL}${url}`;
};