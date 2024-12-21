
import { Navigate } from "react-router";

import { auth } from "../config/firebase";

import PropTypes from 'prop-types';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Box, LinearProgress } from "@mui/material";

export default function ProtectedRoute({ children }) {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return   <Box sx={{ width: '100%' }}>
    <LinearProgress />
  </Box>
  }

  return user ? children : <Navigate to="/" />;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
