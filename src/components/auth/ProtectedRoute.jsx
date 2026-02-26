import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
const ProtectedRoute = ({ children, type }) => {
    const { isAuthReady, isAdminAuthenticated, isUserAuthenticated } = useAuth();
    const location = useLocation();
    if (!isAuthReady) {
        return null;
    }
    if (type === 'admin' && !isAdminAuthenticated) {
        return <Navigate to="/admin/login" state={{ from: location }} replace/>;
    }
    if (type === 'user' && !isUserAuthenticated) {
        return <Navigate to="/user/login" state={{ from: location }} replace/>;
    }
    return <>{children}</>;
};
export default ProtectedRoute;
