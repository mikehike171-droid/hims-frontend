// src/lib/authService.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003';
const API_Domain_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003';
const SETTINGS_API_URL = process.env.NEXT_PUBLIC_SETTINGS_API_URL || 'https://cheerful-commitment-production-66e5.up.railway.app/api';
//const PATIENT_API_URL = process.env.NEXT_PUBLIC_PATIENT_API_URL || 'http://localhost:3003';
const FRONT_OFFICE_API_URL = process.env.NEXT_PUBLIC_FRONT_OFFICE_API_URL || 'http://localhost:3003';

// Initialize API URLs in localStorage (called when needed)
const initializeApiUrls = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('API_URL', API_URL);
    localStorage.setItem('API_Domain_URL', API_Domain_URL);
    localStorage.setItem('SETTINGS_API_URL', SETTINGS_API_URL);
    //localStorage.setItem('PATIENT_API_URL', PATIENT_API_URL);
    localStorage.setItem('FRONT_OFFICE_API_URL', FRONT_OFFICE_API_URL);
  }
};


const login = async (username: string, password: string) => {
  initializeApiUrls();
  const response = await fetch(SETTINGS_API_URL + '/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Login failed');
  }

  const result = await response.json();
  const data = result.data;

  if (data) {
    // Store auth data in localStorage
    localStorage.setItem('authToken', data.access_token);
    localStorage.setItem('user', JSON.stringify(data.UserInfo));
    localStorage.setItem('sidemenu', JSON.stringify(data.sidemenu));
    localStorage.setItem('moduleAccess', JSON.stringify(data.moduleAccess));
    // Store location_id from UserInfo
    if (data.UserInfo?.location_id) {
      localStorage.setItem('location_id', data.UserInfo.location_id);
    }
    // Set primary_location_id as selected_location_id
    if (data.UserInfo?.primary_location_id) {
      localStorage.setItem('selected_location_id', data.UserInfo.primary_location_id.toString());
    }
  }

  return data;
};

const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  localStorage.removeItem('sidemenu');
  localStorage.removeItem('moduleAccess');
  localStorage.removeItem('selectedBranchId');
  localStorage.removeItem('location_id');
  localStorage.removeItem('selected_location_id');

  // Redirect to login page
  if (typeof window !== 'undefined') {
    window.location.href = '/admin/login';
  }
};

const getUserInfo = () => {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

const getCurrentUser = () => {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

const getCurrentToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
};

const getSideMenu = () => {
  if (typeof window === 'undefined') return [];
  const sidemenu = localStorage.getItem('sidemenu');
  return sidemenu ? JSON.parse(sidemenu) : [];
};

const getModuleAccess = () => {
  if (typeof window === 'undefined') return [];
  const moduleAccess = localStorage.getItem('moduleAccess');
  return moduleAccess ? JSON.parse(moduleAccess) : [];
};

const getApiUrl = () => {
  if (typeof window === 'undefined') return API_URL;
  return localStorage.getItem('API_URL') || API_URL;
};

const getApiDomainUrl = () => {
  if (typeof window === 'undefined') return API_Domain_URL;
  return localStorage.getItem('API_Domain_URL') || API_Domain_URL;
};

const getSettingsApiUrl = () => {
  if (typeof window === 'undefined') return SETTINGS_API_URL;
  return localStorage.getItem('SETTINGS_API_URL') || SETTINGS_API_URL;
};

// const getPatientApiUrl = () => {
//   if (typeof window === 'undefined') return PATIENT_API_URL;
//   return localStorage.getItem('PATIENT_API_URL') || PATIENT_API_URL;
// };

const getFrontOfficeApiUrl = () => {
  if (typeof window === 'undefined') return FRONT_OFFICE_API_URL;
  return localStorage.getItem('FRONT_OFFICE_API_URL') || FRONT_OFFICE_API_URL;
};

const getSelectedBranchId = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('selectedBranchId');
};

const setSelectedBranchId = (branchId: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('selectedBranchId', branchId);
  }
};

const setSelectedLocationId = (locationId: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('selected_location_id', locationId);
    // Dispatch location change event to update all components
    window.dispatchEvent(new CustomEvent('locationChanged', { detail: { locationId } }));
  }
};

const getLocationId = () => {
  if (typeof window === 'undefined') return null;
  
  // Always prioritize selected_location_id first
  const selectedLocationId = localStorage.getItem('selected_location_id');
  if (selectedLocationId) {
    return selectedLocationId;
  }
  
  // Fallback to user's primary location
  const userData = localStorage.getItem('user');
  if (userData) {
    try {
      const user = JSON.parse(userData);
      if (user.primary_location_id) {
        return user.primary_location_id.toString();
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }
  
  return null;
};

const authService = {
  login,
  logout,
  getCurrentUser,
  getUserInfo,
  getCurrentToken,
  getSideMenu,
  getModuleAccess,
  getApiUrl,
  getApiDomainUrl,
  getSettingsApiUrl,
  getFrontOfficeApiUrl,
  getSelectedBranchId,
  setSelectedBranchId,
  getLocationId,
  setSelectedLocationId,
};

export default authService;