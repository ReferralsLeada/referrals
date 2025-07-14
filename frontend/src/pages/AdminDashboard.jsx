//src/pages/AdminDashboard.jsx

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { fetchApprovedAffiliates } from '../api/admin';

import {
  getDashboardStats,
  fetchPendingAffiliates,
  approveAffiliate,
  deleteAffiliate
} from '../api/admin';
import Navbar from '../components/Navbar';
import {
  Menu, Users, Link2, DollarSign, Percent, UserPlus, Bell, LogOut
} from 'lucide-react';

export default function AdminDashboard() {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(admin.name || 'Super Admin');
  const [stats, setStats] = useState(null);
  const [affiliates, setAffiliates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [affiliatesLoading, setAffiliatesLoading] = useState(true);
  const [error, setError] = useState('');
  
  const adminList = ['Super Admin', 'Finance Admin', 'Operations Admin'];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getDashboardStats(admin.token);
        setStats(res.data.data.stats);
      } catch (err) {
        setError('Failed to load stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [admin.token]);

  useEffect(() => {
    const loadAffiliates = async () => {
      try {
        const res = await fetchPendingAffiliates(admin.token);
        const list = res?.data?.data?.affiliates || [];
        setAffiliates(list);
      } catch (err) {
        console.error('Error fetching affiliates:', err);
      } finally {
        setAffiliatesLoading(false);
      }
    };
    loadAffiliates();
  }, [admin.token]);

  const [approvedAffiliates, setApprovedAffiliates] = useState([]);
  const [approvedLoading, setApprovedLoading] = useState(true);

  useEffect(() => {
    const fetchApproved = async () => {
      try {
        const res = await fetchApprovedAffiliates(admin.token);
        setApprovedAffiliates(res.data.data.affiliates);
      } catch (err) {
        console.error('Error loading approved affiliates:', err);
      } finally {
        setApprovedLoading(false);
      }
    };
    fetchApproved();
  }, [admin.token]);


  const handleApprove = async (id) => {
    try {
      await approveAffiliate(id, admin.token);
      setAffiliates(prev => prev.filter(a => a._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemove = async (id) => {
    try {
      await deleteAffiliate(id, admin.token);
      setAffiliates(prev => prev.filter(a => a._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const renderContent = () => {
    if (loading) return <div className="text-center py-6">Loading dashboard...</div>;
    if (error) return <div className="text-red-500 text-center py-6">{error}</div>;

    switch (activeTab) {
      case 'overview':
        return (

          <div>

            <h2 className="text-2xl font-bold text-green-500 mb-6">Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <Card label="Total Affiliates" value={stats?.totalAffiliates || 0} textColor="text-indigo-400" />
              <Card label="Approved Affiliates" value={stats?.approvedAffiliates || 0} textColor="text-green-400" />
              <Card label="Pending Affiliates" value={stats?.pendingAffiliates || 0} textColor="text-fuchsia-400" />

            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ChartCard title="Active Campaigns" />
              <ChartCard title="Earnings Chart" />
            </div>
          </div>
        );

      case 'approved':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Approved Affiliates</h2>
            {approvedLoading ? (
              <p>Loading approved affiliates...</p>
            ) : approvedAffiliates.length === 0 ? (
              <p>No approved affiliates</p>
            ) : (
              <table className="w-full bg-white rounded-lg overflow-hidden shadow">
                <thead className="bg-blue-100">
                  <tr>
                    <th className="text-left px-4 py-2">Name</th>
                    <th className="text-left px-4 py-2">Email</th>
                    <th className="text-left px-4 py-2">Referral ID</th>
                  </tr>
                </thead>
                <tbody>
                  {approvedAffiliates.map(a => (
                    <tr key={a._id} className="border-t">
                      <td className="px-4 py-2">{a.name}</td>
                      <td className="px-4 py-2">{a.email}</td>
                      <td className="px-4 py-2">{a.referralId || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        );


      case 'affiliates':
        return (
          <div>

            <h2 className="text-xl font-semibold mb-4">Pending Affiliate Approvals</h2>
            {affiliatesLoading ? (
              <p>Loading affiliates...</p>
            ) : affiliates.length === 0 ? (
              <p>No pending affiliates</p>
            ) : (
              <table className="w-full bg-white rounded-lg overflow-hidden shadow">
                <thead className="bg-green-100">
                  <tr>
                    <th className="text-left px-4 py-2">Name</th>
                    <th className="text-left px-4 py-2">Email</th>
                    <th className="text-left px-4 py-2">Referral ID</th>
                    <th className="text-left px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {affiliates.map(a => (
                    <tr key={a._id} className="border-t">
                      <td className="px-4 py-2">{a.name}</td>
                      <td className="px-4 py-2">{a.email}</td>
                      <td className="px-4 py-2">{a.referralId || 'N/A'}</td>
                      <td className="px-4 py-2 space-x-2">
                        <button onClick={() => handleApprove(a._id)} className="bg-green-600 text-white px-3 py-1 rounded">Approve</button>
                        <button onClick={() => handleRemove(a._id)} className="bg-red-500 text-white px-3 py-1 rounded">Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        );
      case 'referrals':
        return <div><h2 className="text-xl font-semibold mb-4">Recent Referrals</h2><p>[Static referral data here]</p></div>;
      case 'payouts':
        return <div><h2 className="text-xl font-semibold mb-4">Payout History</h2><p>[Static payouts info here]</p></div>;
      case 'commission':
        return <div><h2 className="text-xl font-semibold mb-4">Commission Configuration</h2><ul className="list-disc ml-6 mt-2 space-y-1">
          <li>2% for referral website account creation</li>
          <li>4% for sample product 1</li>
          <li>6% for sample product 2</li>
          <li>7% for sample product 3</li>
        </ul></div>;
      case 'signup':
        navigate('/affiliate/signup');
        return null;
      case 'notifications':
        return <div><h2 className="text-xl font-semibold mb-4">Notifications</h2><p>[Notification placeholder]</p></div>;
      default:
        return <div>Select a page</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-gradient-to-b from-green-800 to-green-600 text-white p-4 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Admin Panel</h2>
          <Menu className="cursor-pointer" />
        </div>
        <NavItem icon={<Users />} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
        <NavItem icon={<Users />} label="Affiliates" active={activeTab === 'affiliates'} onClick={() => setActiveTab('affiliates')} />
        <NavItem icon={<Link2 />} label="Referrals" active={activeTab === 'referrals'} onClick={() => setActiveTab('referrals')} />
        <NavItem icon={<DollarSign />} label="Payouts" active={activeTab === 'payouts'} onClick={() => setActiveTab('payouts')} />
        <NavItem icon={<Percent />} label="Commission" active={activeTab === 'commission'} onClick={() => setActiveTab('commission')} />
        <NavItem icon={<UserPlus />} label="Affiliate Signup" active={activeTab === 'signup'} onClick={() => setActiveTab('signup')} />
        <NavItem icon={<Bell />} label="Notifications" active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} />
        <NavItem icon={<LogOut />} label="Logout" onClick={logout} />
        <NavItem
          icon={<Users />}
          label="Affiliate List"
          active={activeTab === 'approved'}
          onClick={() => setActiveTab('approved')}
        />

      </aside>

      <main className="flex-1 p-6">
        <div className="flex justify-between mb-6  bg-white p-4 ">
          <div>
            <Navbar />

          </div>
          <h1 className="text-2xl bg-white p-4  font-bold text-gray-800">Admin Dashboard</h1>

          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="px-3 py-1 text-sm bg-green-100 text-green-900 rounded hover:bg-green-200"
            >
              {selectedAdmin}
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded z-10">
                {adminList.map((name) => (
                  <div
                    key={name}
                    className={`px-4 py-2 text-sm cursor-pointer hover:bg-green-100 ${selectedAdmin === name ? 'bg-green-50 font-semibold' : ''}`}
                    onClick={() => {
                      setSelectedAdmin(name);
                      setDropdownOpen(false);
                    }}
                  >
                    {name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {renderContent()}
      </main>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 cursor-pointer px-4 py-2 rounded hover:bg-green-700 ${active ? 'bg-green-700 font-semibold' : ''}`}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
}

function Card({ label, value, textColor }) {
  return (
    <div className="bg-gray-800 text-white rounded-lg p-6">
      <p className="text-sm text-gray-300 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
    </div>
  );
}

function ChartCard({ title }) {
  return (
    <div className="bg-gray-800 text-white rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="h-40 bg-gray-700 rounded flex items-center justify-center">[{title} Placeholder]</div>
    </div>
  );
}
