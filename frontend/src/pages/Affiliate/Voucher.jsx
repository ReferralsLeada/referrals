import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import axios from 'axios';

export default function Voucher() {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [vouchers, setVouchers] = useState([]);
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    usageLimit: '',
    expiresAt: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

  const fetchVouchers = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/vouchers/my`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setVouchers(res.data.data.vouchers);
    } catch (err) {
      setError('Failed to load vouchers');
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchVouchers();
    }
  }, [user?.token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      await axios.post(`${baseUrl}/api/vouchers/create`, formData, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setMessage('Voucher created successfully!');
      setFormData({
        code: '',
        discountType: 'percentage',
        discountValue: '',
        usageLimit: '',
        expiresAt: ''
      });
      fetchVouchers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create voucher');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <h2 className="text-2xl font-bold mb-4">Referral Vouchers</h2>

      <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input
          name="code"
          placeholder="Voucher Code (e.g., LEDA10)"
          value={formData.code}
          onChange={handleChange}
          required
          className="p-2 rounded border"
        />
        <select
          name="discountType"
          value={formData.discountType}
          onChange={handleChange}
          className="p-2 rounded border"
        >
          <option value="percentage">Percentage</option>
          <option value="flat">Flat</option>
        </select>
        <input
          name="discountValue"
          type="number"
          placeholder="Discount Value"
          value={formData.discountValue}
          onChange={handleChange}
          required
          className="p-2 rounded border"
        />
        <input
          name="usageLimit"
          type="number"
          placeholder="Usage Limit"
          value={formData.usageLimit}
          onChange={handleChange}
          className="p-2 rounded border"
        />
        <input
          name="expiresAt"
          type="date"
          value={formData.expiresAt}
          onChange={handleChange}
          className="p-2 rounded border"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 col-span-1 md:col-span-2"
        >
          {loading ? 'Creating...' : 'Create Voucher'}
        </button>
      </form>

      {error && <p className="text-red-500">{error}</p>}
      {message && <p className="text-green-600">{message}</p>}

      <h3 className="text-xl font-semibold mt-6 mb-2">My Vouchers</h3>
      <table className="min-w-full border rounded text-sm">
        <thead className="bg-green-200 text-left">
          <tr>
            <th className="p-2">Code</th>
            <th className="p-2">Discount</th>
            <th className="p-2">Usage</th>
            <th className="p-2">Expires</th>
            <th className="p-2">Clicks</th>
            <th className="p-2">Share</th>
          </tr>
        </thead>
        <tbody>
          {vouchers.map(v => (
            <tr key={v._id} className="border-t">
              <td className="p-2 font-mono">{v.code}</td>
              <td className="p-2">
                {v.discountValue}
                {v.discountType === 'percentage' ? '%' : '₹'}
              </td>
              <td className="p-2">{v.usageLimit || '∞'}</td>
              <td className="p-2">{v.expiresAt?.slice(0, 10) || 'N/A'}</td>
              <td className="p-2">{v.clicks || 0}</td>
              <td className="p-2">
                <button
                  onClick={() => navigator.clipboard.writeText(`${baseUrl}/api/vouchers/track?code=${v.code}`)}
                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                >
                  Copy Link
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
