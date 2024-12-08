
import { Navigate } from "react-router";

import { auth } from "../config/firebase";

import PropTypes from 'prop-types';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function ProtectedRoute({ children }) {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? children : <Navigate to="/" />;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
