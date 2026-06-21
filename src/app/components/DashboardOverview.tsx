import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MessageSquare, Users, Package, TrendingUp, Calendar } from 'lucide-react';
import { API_ENDPOINTS } from '../../config/api';
import { auth } from '../../config/auth';

type WeekPoint = { day: string; count: number };

const defaultChartData: WeekPoint[] = [
  { day: 'Mon', count: 0 },
  { day: 'Tue', count: 0 },
  { day: 'Wed', count: 0 },
  { day: 'Thu', count: 0 },
  { day: 'Fri', count: 0 },
  { day: 'Sat', count: 0 },
  { day: 'Sun', count: 0 },
];

export default function DashboardOverview() {
  const [chartData, setChartData] = useState<WeekPoint[]>(defaultChartData);
  const [recent, setRecent] = useState<any[]>([]);
  const [totalSubscribers, setTotalSubscribers] = useState<number | null>(null);
  const [activePackages, setActivePackages] = useState<number | null>(null);
  const [inquiryCount, setInquiryCount] = useState<number | null>(null);
  const [conversionRate, setConversionRate] = useState<number | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = auth.getToken();
        const res = await fetch(API_ENDPOINTS.adminAnalytics(), {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (!res.ok) return;
        const data = await res.json();

        // chart data
        if (Array.isArray(data.inquiry_week_report)) {
          // Map to WeekPoint and keep order
          setChartData(data.inquiry_week_report.map((p: any) => ({ day: p.day, count: p.count })));
        }

        setTotalSubscribers(data.total_subscribers ?? null);
        setActivePackages(data.active_packages ?? null);
        setInquiryCount(data.inquiry_count ?? null);

        // conversion_rate might be fraction or percent
        if (data.conversion_rate != null) {
          const cr = Number(data.conversion_rate);
          setConversionRate(cr <= 1 ? Math.round(cr * 100) : Math.round(cr));
        }

        // recent inquiries - map to display-friendly shape
        if (Array.isArray(data.latest_inquiries)) {
          setRecent(
            data.latest_inquiries.map((iq: any) => ({
              id: iq.id,
              name: iq.full_name || iq.email || '—',
              package: iq.destination || (`Package ${iq.travel_package_id ?? ''}`),
              status: iq.status || 'Pending',
              created_at: iq.created_at,
            }))
          );
        }
      } catch (e) {
        // ignore
      }
    };

    fetchAnalytics();
  }, []);

  const stats = [
    {
      icon: MessageSquare,
      label: 'New Inquiries Today',
      value: chartData.length ? String(chartData[chartData.length - 1].count) : '-',
      change: '',
      bgColor: 'bg-chart-1/10',
      iconColor: 'text-chart-1',
    },
    {
      icon: Users,
      label: 'Total Subscribers',
      value: totalSubscribers != null ? String(totalSubscribers) : '-',
      change: '',
      bgColor: 'bg-chart-2/10',
      iconColor: 'text-chart-2',
    },
    {
      icon: Package,
      label: 'Active Packages',
      value: activePackages != null ? String(activePackages) : '-',
      change: '',
      bgColor: 'bg-chart-3/10',
      iconColor: 'text-chart-3',
    },
    {
      icon: TrendingUp,
      label: 'Conversion Rate',
      value: conversionRate != null ? `${conversionRate}%` : '-',
      change: '',
      bgColor: 'bg-chart-4/10',
      iconColor: 'text-chart-4',
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="mb-2">Dashboard Overview</h1>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>Today is {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 ${stat.bgColor} rounded-lg`}>
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
              <span className="text-sm text-chart-4">{stat.change}</span>
            </div>
            <p className="text-3xl mb-1">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inquiry Chart */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="mb-6">Weekly Inquiry Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '0.5rem',
                }}
              />
              <Bar dataKey="count" fill="var(--chart-1)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Inquiries */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="mb-6">Recent Inquiries</h3>
          <div className="space-y-4">
            {recent.map((inquiry) => {
              const date = new Date(inquiry.created_at);
              const diffMs = Date.now() - date.getTime();
              const hours = Math.floor(diffMs / (1000 * 60 * 60));
              const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
              const when = hours > 0 ? `${hours}h ago` : `${minutes}m ago`;

              return (
                <div
                  key={inquiry.id}
                  className="flex items-center justify-between p-4 bg-accent/50 rounded-lg hover:bg-accent transition-colors"
                >
                  <div>
                    <p className="font-medium">{inquiry.name}</p>
                    <p className="text-sm text-muted-foreground">{inquiry.package}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs ${
                        inquiry.status === 'Confirmed'
                          ? 'bg-chart-4/20 text-chart-4'
                          : inquiry.status === 'Quoted'
                          ? 'bg-chart-2/20 text-chart-2'
                          : 'bg-chart-1/20 text-chart-1'
                      }`}
                    >
                      {inquiry.status}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">{when}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
