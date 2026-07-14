import { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';

interface Alert {
  type: 'success' | 'error';
  message: string;
}

export default function AccountSettings() {
  const [profileForm, setProfileForm] = useState({
    username: 'admin',
    email: 'admin@tour.com',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [profileAlert, setProfileAlert] = useState<Alert | null>(null);
  const [passwordAlert, setPasswordAlert] = useState<Alert | null>(null);

  const [savedCredentials, setSavedCredentials] = useState({
    username: 'admin',
    email: 'admin@tour.com',
    password: 'admin123',
  });

  const showAlert = (setter: (a: Alert | null) => void, alert: Alert) => {
    setter(alert);
    setTimeout(() => setter(null), 4000);
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.username.trim()) {
      showAlert(setProfileAlert, { type: 'error', message: 'Username cannot be empty.' });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileForm.email)) {
      showAlert(setProfileAlert, { type: 'error', message: 'Please enter a valid email address.' });
      return;
    }
    setSavedCredentials((prev) => ({
      ...prev,
      username: profileForm.username,
      email: profileForm.email,
    }));
    showAlert(setProfileAlert, { type: 'success', message: 'Profile updated successfully.' });
  };

  const handlePasswordSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.currentPassword !== savedCredentials.password) {
      showAlert(setPasswordAlert, { type: 'error', message: 'Current password is incorrect.' });
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      showAlert(setPasswordAlert, { type: 'error', message: 'New password must be at least 6 characters.' });
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showAlert(setPasswordAlert, { type: 'error', message: 'Passwords do not match.' });
      return;
    }
    setSavedCredentials((prev) => ({ ...prev, password: passwordForm.newPassword }));
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    showAlert(setPasswordAlert, { type: 'success', message: 'Password changed successfully.' });
  };

  const toggle = (field: 'current' | 'new' | 'confirm') =>
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Account Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your login credentials</p>
      </div>

      {/* Profile Section */}
      <section className="bg-card border border-border rounded-xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Profile</h2>
            <p className="text-sm text-muted-foreground">Update your username and email</p>
          </div>
        </div>

        <AlertBanner alert={profileAlert} />

        <form onSubmit={handleProfileSave} className="space-y-4">
          <Field
            label="Username"
            icon={<User className="w-4 h-4" />}
            value={profileForm.username}
            onChange={(v) => setProfileForm((p) => ({ ...p, username: v }))}
            placeholder="Enter username"
          />
          <Field
            label="Email"
            icon={<Mail className="w-4 h-4" />}
            value={profileForm.email}
            onChange={(v) => setProfileForm((p) => ({ ...p, email: v }))}
            placeholder="Enter email"
            type="email"
          />
          <button
            type="submit"
            className="mt-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Save Profile
          </button>
        </form>
      </section>

      {/* Password Section */}
      <section className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Change Password</h2>
            <p className="text-sm text-muted-foreground">Must be at least 6 characters</p>
          </div>
        </div>

        <AlertBanner alert={passwordAlert} />

        <form onSubmit={handlePasswordSave} className="space-y-4">
          <PasswordField
            label="Current Password"
            value={passwordForm.currentPassword}
            show={showPasswords.current}
            onToggle={() => toggle('current')}
            onChange={(v) => setPasswordForm((p) => ({ ...p, currentPassword: v }))}
            placeholder="Enter current password"
          />
          <PasswordField
            label="New Password"
            value={passwordForm.newPassword}
            show={showPasswords.new}
            onToggle={() => toggle('new')}
            onChange={(v) => setPasswordForm((p) => ({ ...p, newPassword: v }))}
            placeholder="Enter new password"
          />
          <PasswordField
            label="Confirm New Password"
            value={passwordForm.confirmPassword}
            show={showPasswords.confirm}
            onToggle={() => toggle('confirm')}
            onChange={(v) => setPasswordForm((p) => ({ ...p, confirmPassword: v }))}
            placeholder="Confirm new password"
          />
          <button
            type="submit"
            className="mt-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Change Password
          </button>
        </form>
      </section>
    </div>
  );
}

function Field({
  label,
  icon,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
        />
      </div>
    </div>
  );
}

function PasswordField({
  label,
  value,
  show,
  onToggle,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  show: boolean;
  onToggle: () => void;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          <Lock className="w-4 h-4" />
        </span>
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-9 pr-10 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

function AlertBanner({ alert }: { alert: { type: 'success' | 'error'; message: string } | null }) {
  if (!alert) return null;
  const isSuccess = alert.type === 'success';
  return (
    <div
      className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm mb-4 ${
        isSuccess
          ? 'bg-green-50 text-green-700 border border-green-200'
          : 'bg-red-50 text-red-700 border border-red-200'
      }`}
    >
      {isSuccess ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
      {alert.message}
    </div>
  );
}
