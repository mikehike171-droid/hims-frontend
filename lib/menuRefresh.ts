// Utility to refresh menu data with updated icons
export const refreshMenuData = () => {
  if (typeof window !== 'undefined') {
    // Clear existing menu data to force refresh on next login
    localStorage.removeItem('sidemenu');
    localStorage.removeItem('moduleAccess');
    
    // Optionally redirect to login to get fresh data
    const shouldRelogin = confirm('Menu data needs to be refreshed. Would you like to log out and log back in to see the updated icons?');
    if (shouldRelogin) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  }
};

export default refreshMenuData;