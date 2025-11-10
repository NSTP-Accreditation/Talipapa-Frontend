import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRBAC } from '../../hooks/useRBAC';
import { Permission } from '../../types/rbac.types';
import { APP_ROUTES } from '../../utils/constants/routes';

/**
 * AdminRedirect Component
 *
 * Redirects users to their appropriate landing page based on permissions:
 * - SuperAdmin: Dashboard
 * - Admin: First accessible Home Editable section (Guidelines)
 */
const AdminRedirect = () => {
  const navigate = useNavigate();
  const { hasPermission } = useRBAC();

  useEffect(() => {
    // Check if user can view dashboard (SuperAdmin)
    if (hasPermission(Permission.VIEW_REPORTS)) {
      navigate(APP_ROUTES.ADMIN.DASHBOARD, { replace: true });
    }
    // Otherwise redirect to first Home Editable section
    else if (hasPermission(Permission.VIEW_GUIDELINES)) {
      navigate(APP_ROUTES.ADMIN.BASE + '/guidelines', { replace: true });
    } else if (hasPermission(Permission.VIEW_NEWS)) {
      navigate(APP_ROUTES.ADMIN.NEWS, { replace: true });
    } else if (hasPermission(Permission.VIEW_CONTENT)) {
      navigate(APP_ROUTES.ADMIN.CAROUSEL, { replace: true });
    } else if (hasPermission(Permission.VIEW_ACHIEVEMENTS)) {
      navigate(APP_ROUTES.ADMIN.ABOUT + '/achievements', { replace: true });
    } else {
      // Fallback - should not happen if RBAC is configured correctly
      navigate(APP_ROUTES.ADMIN.ABOUT, { replace: true });
    }
  }, [navigate, hasPermission]);

  // Show loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">Redirecting...</p>
      </div>
    </div>
  );
};

export default AdminRedirect;
