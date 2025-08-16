import { Navigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { CircularProgress } from '@mui/material';
import PropTypes from 'prop-types';

export default function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <CircularProgress />;
  }

  return isAuthenticated ? children : <Navigate to="/" />;
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
