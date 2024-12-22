import { useDispatch } from 'react-redux';
import { logout } from '../../store/auth/authSlice';
import { useAuth } from '../../hooks/useAuth';
import { Link, useNavigate } from 'react-router';

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const handleLogout = () => {
    dispatch(logout())
      .unwrap()
      .then(() => {
        navigate('/');
      })
      .catch((error) => {
        console.error("Logout failed: ", error);
      });
  };

  return (
    <header className="flex justify-between p-4 bg-gray-800 text-white">
      <Link to="/home" className="text-xl font-bold">
        Toko Saya
      </Link>
      {isAuthenticated && (
        <div className="flex items-center space-x-4">
          <span>Halo, {user.email}</span>
          <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
