import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAdmins, createAdmin } from '../../api/admin';

export default function ManageAdmins() {
  const { user } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await getAdmins(user.token);
        setAdmins(response.data.data.admins);
      } catch (err) {
        setError('Failed to load admins');
      }
    };
    fetchAdmins();
  }, [user]);

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createAdmin(newAdmin, user.token);
      setNewAdmin({ name: '', email: '' });
      const response = await getAdmins(user.token);
      setAdmins(response.data.data.admins);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create admin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Manage Admins</h1>
      
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Create New Admin</h2>
        <form onSubmit={handleCreateAdmin} className="space-y-4">
          <div>
            <label className="block mb-1">Name</label>
            <input
              type="text"
              value={newAdmin.name}
              onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              value={newAdmin.email}
              onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Admin'}
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Admin List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="text-left p-2">Name</th>
                <th className="text-left p-2">Email</th>
                <th className="text-left p-2">Role</th>
              </tr>
            </thead>
            <tbody>
              {admins.map(admin => (
                <tr key={admin._id} className="border-t">
                  <td className="p-2">{admin.name}</td>
                  <td className="p-2">{admin.email}</td>
                  <td className="p-2 capitalize">{admin.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}