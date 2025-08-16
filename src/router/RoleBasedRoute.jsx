import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { ROLES, isAdmin, isCustomer } from '../utils/roleUtils';
import PropTypes from 'prop-types';

// Component untuk melindungi route yang hanya boleh diakses oleh role tertentu
const RoleBasedRoute = ({ children, allowedRoles, redirectTo = '/signin' }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  // Jika user belum login, redirect ke signin
  if (!isAuthenticated || !user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Jika user sudah login tapi tidak memiliki role yang diizinkan
  if (allowedRoles && allowedRoles.length > 0) {
    const hasPermission = allowedRoles.includes(user.role);
    
    if (!hasPermission) {
      // Redirect ke halaman yang sesuai dengan role user
      const defaultRedirect = user.role === ROLES.ADMIN ? '/admin' : '/';
      return <Navigate to={defaultRedirect} replace />;
    }
  }

  // Jika semua validasi berhasil, tampilkan children
  return children;
};

// Component khusus untuk Admin-only routes
export const AdminOnlyRoute = ({ children }) => {
  return (
    <RoleBasedRoute allowedRoles={[ROLES.ADMIN]} redirectTo="/signin">
      {children}
    </RoleBasedRoute>
  );
};

// Component khusus untuk Customer-only routes
export const CustomerOnlyRoute = ({ children }) => {
  return (
    <RoleBasedRoute allowedRoles={[ROLES.CUSTOMER]} redirectTo="/signin">
      {children}
    </RoleBasedRoute>
  );
};

// Component untuk melindungi route yang memerlukan authentication tapi tidak peduli role
export const AuthenticatedRoute = ({ children }) => {
  return (
    <RoleBasedRoute allowedRoles={[ROLES.ADMIN, ROLES.CUSTOMER]} redirectTo="/signin">
      {children}
    </RoleBasedRoute>
  );
};

// Component untuk redirect otomatis berdasarkan role user
export const RoleBasedRedirect = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated || !user) {
    return <Navigate to="/signin" replace />;
  }

  if (isAdmin(user.role)) {
    return <Navigate to="/admin" replace />;
  }

  if (isCustomer(user.role)) {
    return <Navigate to="/" replace />;
  }

  // Default fallback
  return <Navigate to="/" replace />;
};

RoleBasedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
  redirectTo: PropTypes.string,
};

AdminOnlyRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

CustomerOnlyRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

AuthenticatedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default RoleBasedRoute;
