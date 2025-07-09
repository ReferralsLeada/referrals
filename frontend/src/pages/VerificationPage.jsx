import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function VerificationPage() {
  const { userId, token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Verifying...');
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
     const response = await axios.get(
  `/api/admin/auth/verify/${userId}/${token}`,
  {
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  }
);

        setStatus('Verification successful!');
        setTimeout(() => navigate('/admin/login'), 3000);
      } catch (err) {
        setError(err.response?.data?.message || 'Verification failed');
        setStatus('Verification failed');
      }
    };

    verifyEmail();
  }, [userId, token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center p-8 max-w-md">
        <h1 className="text-2xl font-bold mb-4">
          {status}
        </h1>
        {error && (
          <div className="text-red-500 mb-4">
            {error}
          </div>
        )}
        <p className="text-gray-600">
          {!error && 'Redirecting to login page...'}
        </p>
      </div>
    </div>
  );
}