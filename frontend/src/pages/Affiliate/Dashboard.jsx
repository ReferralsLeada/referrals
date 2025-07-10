import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAffiliateStats } from '../../api/affiliate';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { Menu, BarChart3, Link2, LogOut, LayoutDashboard, Zap, Users, Percent, TrendingUp } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Voucher from './Voucher';


export default function AffiliateDashboard() {
  const { user, role, logout } = useAuth();
  const { darkMode } = useTheme();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || role !== 'affiliate') {
      navigate('/affiliate/login');
      return;
    }

    const fetchStats = async () => {
      try {
        const response = await getAffiliateStats(user.token);
        setStats(response.data.data);
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user, role, navigate]);

  const chartData = stats?.commissionData?.map(item => ({
    name: item.name.length > 10 ? item.name.substring(0, 10) + '...' : item.name,
    commission: item.commission
  })) || [];

  const contentStyles = `p-6 transition-all duration-300 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className={contentStyles}>
            <Navbar />
            <SidebarItem icon={<Zap />} label="Vouchers" collapsed={collapsed} onClick={() => setActiveTab('vouchers')} />

            
            <h2 className="text-2xl font-bold mb-6">Welcome {stats?.admin?.name}</h2>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="p-4 bg-gradient-to-r from-green-300 to-green-500 text-white rounded shadow">
                <p className="text-sm">Total Referrals</p>
                <p className="text-2xl font-semibold">{stats?.totalReferrals || 0}</p>
              </div>
              <div className="p-4 bg-gradient-to-r from-green-400 to-green-600 text-white rounded shadow">
                <p className="text-sm">Total Commission</p>
                <p className="text-2xl font-semibold">${stats?.totalCommission || 0}</p>
              </div>
              <div className="p-4 bg-gradient-to-r from-green-500 to-green-700 text-white rounded shadow">
                <p className="text-sm">Active Campaign</p>
                <p className="text-2xl font-semibold">#LEDA-2025</p>
              </div>
            </div>
            <div className="h-64 bg-white dark:bg-gray-700 rounded shadow p-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="commission" fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2">Top Performer (Last 30 Days)</h3>
              <div className="flex items-center justify-between p-4 bg-green-100 dark:bg-green-800 rounded">
                <div>
                  <p className="font-bold">Jane Doe</p>
                  <p className="text-sm">Income: $324.22</p>
                </div>
                <span className="text-green-700 dark:text-green-200 font-bold">Today's Income: $48</span>
              </div>
            </div>
          </div>
        );

      case 'customers':
        return (
          <div className={contentStyles}>
            <Navbar />
            <h2 className="text-xl font-semibold mb-4">Customer Overview</h2>
            <div className="overflow-auto">
              <table className="min-w-full text-left border">
                <thead>
                  <tr className="bg-green-200">
                    <th className="p-2">Name</th>
                    <th className="p-2">Email</th>
                    <th className="p-2">Referral Code</th>
                    <th className="p-2">Total Earnings</th>
                    <th className="p-2">Join Date</th>
                    <th className="p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2">John Smith</td>
                    <td className="p-2">john@example.com</td>
                    <td className="p-2">LED123</td>
                    <td className="p-2">$85</td>
                    <td className="p-2">2024-05-01</td>
                    <td className="p-2 text-green-600">Active</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Amy White</td>
                    <td className="p-2">amy@example.com</td>
                    <td className="p-2">LED456</td>
                    <td className="p-2">$0</td>
                    <td className="p-2">2024-06-12</td>
                    <td className="p-2 text-yellow-600">Pending</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Mark Tailor</td>
                    <td className="p-2">mark@example.com</td>
                    <td className="p-2">LED789</td>
                    <td className="p-2">$16</td>
                    <td className="p-2">2024-06-22</td>
                    <td className="p-2 text-red-600">Blocked</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'commission':
        return (
          <div className={contentStyles}>
            <Navbar />
            <h2 className="text-xl font-semibold mb-4">Commission Structure</h2>
            <ul className="space-y-2 text-green-700 dark:text-green-300 font-medium">
              <li>🔹 2% for referral website account creation</li>
              <li>🔹 4% for Sample Product 1</li>
              <li>🔹 6% for Sample Product 2</li>
              <li>🔹 7% for Sample Product 3</li>
            </ul>
          </div>
        );
        case 'vouchers':
  return <Voucher />;


      case 'performance':
        return (
          <div className={contentStyles}>
            <Navbar />
            <h2 className="text-xl font-semibold mb-4">Performance Report</h2>
            <p className="text-green-600 dark:text-green-300">Your affiliate conversions are up 24% this month. Keep sharing!</p>
         
          
          </div>
        );

      default:
        return (
         <div className="{contentStyles}">
          <Navbar/>
        <h2 className="text-xl font-semibold  text-green-700 dark:text-green-300 mb-4">Your Referral Info</h2>
        <p className="mb-2  text-gray-70 dark:text-white font-medium">
          Your Referral ID: <span className="font-mono bg-green-800  p-1 rounded">{stats.affiliate.referralId}</span>
        </p>
        <p className='font-xs '>Commission Rate: {stats.affiliate.commissionRate}%</p>
      </div>
        );
    }
  };

  if (loading) return <div className="text-center py-6">Loading dashboard...</div>;
  if (error) return <div className="text-red-500 text-center py-6">{error}</div>;

  return (
    <div className={`flex min-h-screen transition-colors ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      
      <aside className={`transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'} ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} shadow-lg`}>
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className={`font-bold text-lg ${collapsed ? 'hidden' : 'block'}`}>Affiliate Panel</h1>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full" onClick={() => setCollapsed(!collapsed)}>
            <Menu className="h-5 w-5" />
          </button>
        </div>
        <nav className="mt-6 space-y-2 px-2">
          <SidebarItem icon={<LayoutDashboard />} label="Dashboard" collapsed={collapsed} onClick={() => setActiveTab('dashboard')} />
          <SidebarItem icon={<Users />} label="Customers" collapsed={collapsed} onClick={() => setActiveTab('customers')} />
          <SidebarItem icon={<Percent />} label="Commission" collapsed={collapsed} onClick={() => setActiveTab('commission')} />
          <SidebarItem icon={<TrendingUp />} label="Performance" collapsed={collapsed} onClick={() => setActiveTab('performance')} />
          <SidebarItem icon={<Link2 />} label="Referrals" collapsed={collapsed} onClick={() => setActiveTab('referrals')} />
          <SidebarItem icon={<LogOut />} label="Logout" collapsed={collapsed} onClick={logout} />
        </nav>
      </aside>

      <main className="flex-1 transition-all duration-300 overflow-y-auto">
        <div className="p-6">{renderContent()}</div>
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, collapsed, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 px-4 py-2 text-left hover:bg-green-100 dark:hover:bg-green-700 rounded transition text-gray-800 dark:text-white"
    >
      {icon}
      {!collapsed && <span className="text-sm font-medium">{label}</span>}
    </button>
  );
}
