import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import CustomerLayout from './components/customer/CustomerLayout';
import HomePage from './components/customer/HomePage';
import AboutPage from './components/customer/AboutPage';
import PackagesPage from './components/customer/PackagesPage';
import PackageDetailPage from './components/customer/PackageDetailPage';
import PartnershipPage from './components/customer/PartnershipPage';
import ContactPage from './components/customer/ContactPage';
import Login from './components/Login';
import DashboardLayout from './components/DashboardLayout';
import DashboardOverview from './components/DashboardOverview';
import InquiryManagement from './components/InquiryManagement';
import SubscriberList from './components/SubscriberList';
import PackageManagement from './components/PackageManagement';
import ContentManagement from './components/ContentManagement';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Customer Website Routes */}
        <Route path="/" element={<CustomerLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="packages" element={<PackagesPage />} />
          <Route path="packages/:id" element={<PackageDetailPage />} />
          <Route path="partnership" element={<PartnershipPage />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>

        {/* Admin Portal Routes */}
        <Route path="/admin" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardOverview />} />
          <Route path="inquiries" element={<InquiryManagement />} />
          <Route path="subscribers" element={<SubscriberList />} />
          <Route path="packages" element={<PackageManagement />} />
          <Route path="content" element={<ContentManagement />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}