import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function VerificationSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/admin/login');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-green-600 mb-4">
          Email VErified Successfully!
        </h1>
        <p className="text-gray-600">
          You will be redirected to login page in 5 seconds...
        </p>
      </div>
    </div>
  );
}