import { useState } from 'react';
import { addAffiliate } from '../api/admin';

export default function AddAffiliateModal({ onClose, refreshData }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    commissionRate: 15 // Default commission rate
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addAffiliate(formData);
      refreshData();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add affiliate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add New Affiliate</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          {/* Form fields */}
          <button type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add Affiliate'}
          </button>
        </form>
      </div>
    </div>
  );
}