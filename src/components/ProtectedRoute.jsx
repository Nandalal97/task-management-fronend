import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../Utility/getToken';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();

    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  return children;
};

export default ProtectedRoute;
