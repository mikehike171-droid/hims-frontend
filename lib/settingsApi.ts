// Settings Microservice API
import authService from './authService';

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    // Redirect to login if no token
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new Error('No authentication token found');
  }
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

const handleApiResponse = async (response: Response) => {
  if (response.status === 401) {
    // Token expired or invalid - redirect to login
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new Error('Authentication failed');
  }
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`API Error ${response.status}:`, errorText);
    throw new Error(`API Error: ${response.status}`);
  }
  return response.json();
};

export const settingsApi = {
  // Users
  getUsers: async (locationId?: string, page = 1, limit = 10, departmentId?: string) => {
    const params = new URLSearchParams();
    if (locationId) params.append('locationId', locationId);
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (departmentId) params.append('departmentId', departmentId);

    const response = await fetch(`${authService.getSettingsApiUrl()}/settings/users?${params}`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  createUser: async (userData: any) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/settings/users`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Create user error:', errorData);
      throw new Error(`HTTP ${response.status}: ${errorData}`);
    }

    return response.json();
  },

  updateUser: async (id: string, userData: any) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/settings/users/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Update user error:', errorData);
      throw new Error(`HTTP ${response.status}: ${errorData}`);
    }

    return response.json();
  },

  deleteUser: async (id: string) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/settings/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return response.ok;
  },

  // Roles
  getRoles: async (locationId?: number) => {
    try {
      const params = new URLSearchParams();
      if (locationId) params.append('locationId', locationId.toString());
      params.append('includeModules', 'true');

      console.log('getRoles API call with params:', params.toString());
      const response = await fetch(`${authService.getSettingsApiUrl()}/settings/roles?${params}`, {
        headers: getAuthHeaders(),
      });
      const result = await handleApiResponse(response);
      console.log('getRoles API response:', result);
      return result;
    } catch (error) {
      console.error('getRoles error:', error);
      return [];
    }
  },

  // Departments
  getDepartments: async (locationId?: string | number) => {
    try {
      const params = locationId ? `?locationId=${locationId}` : '';
      console.log('getDepartments API call with params:', params);
      const response = await fetch(`${authService.getSettingsApiUrl()}/settings/departments${params}`, {
        headers: getAuthHeaders(),
      });
      const result = await handleApiResponse(response);
      console.log('getDepartments API response:', result);
      return result;
    } catch (error) {
      console.error('getDepartments error:', error);
      return [];
    }
  },

  // Locations
  getLocations: async (locationId?: number) => {
    try {
      const params = locationId ? `?locationId=${locationId}` : '';
      const response = await fetch(`${authService.getSettingsApiUrl()}/settings/locations${params}`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getLocations error:', error);
      return [];
    }
  },

  // Locations IP Management
  getLocationsIp: async () => {
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/locationsip`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getLocationsIp error:', error);
      return [];
    }
  },

  createLocationsIp: async (data: any) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/locationsip`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await handleApiResponse(response);
  },

  updateLocationsIp: async (id: number, data: any) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/locationsip/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await handleApiResponse(response);
  },

  deleteLocationsIp: async (id: number) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/locationsip/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return await handleApiResponse(response);
  },

  getRefPatients: async (page: number = 1, limit: number = 10) => {
    const token = localStorage.getItem('authToken');
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    const response = await fetch(`${authService.getSettingsApiUrl()}/patients/ref-patients/list?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Failed to fetch ref patients');
    return response.json();
  },

  getEmployeeRefPatients: async (page: number = 1, limit: number = 10): Promise<any> => {
    const token = localStorage.getItem('authToken');
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    const response = await fetch(`${authService.getSettingsApiUrl()}/patients/employee-ref/list?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Failed to fetch employee ref patients');
    return response.json();
  },

  // Additional methods used in settings page
  getUser: async (id: number) => {
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/settings/users/${id}`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getUser error:', error);
      throw error;
    }
  },

  searchUsers: async (searchTerm: string, locationId?: number) => {
    const params = new URLSearchParams();
    params.append('search', searchTerm);
    if (locationId) params.append('locationId', locationId.toString());
    params.append('page', '1');
    params.append('limit', '100');

    const response = await fetch(`${authService.getSettingsApiUrl()}/settings/users?${params}`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  toggleUserStatus: async (id: number) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/settings/users/${id}/toggle-status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  getDepartmentsByLocation: async (locationId: number) => {
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/settings/departments?locationId=${locationId}`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getDepartmentsByLocation error:', error);
      return [];
    }
  },

  getModules: async (locationId?: number) => {
    try {
      const params = locationId ? `?locationId=${locationId}` : '';
      const response = await fetch(`${authService.getSettingsApiUrl()}/settings/modules${params}`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getModules error:', error);
      return [];
    }
  },

  createRole: async (roleData: any) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/settings/roles`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(roleData),
    });
    return response.json();
  },

  updateRole: async (id: number, roleData: any) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/settings/roles/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(roleData),
    });
    return response.json();
  },

  getModulesWithPermissions: async (roleId: number) => {
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/settings/roles/${roleId}/permissions`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        console.error(`Failed to fetch permissions for role ${roleId}: ${response.status}`);
        // Return empty modules array if the API fails
        return [];
      }

      return await response.json();
    } catch (error) {
      console.error('getModulesWithPermissions error:', error);
      return [];
    }
  },

  updateRolePermissions: async (roleId: number, permissions: any[]) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/settings/roles/${roleId}/permissions`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ permissions }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : { success: true };
  },

  // User Types
  getUserTypes: async () => {
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/user-types`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getUserTypes error:', error);
      return [];
    }
  },

  createUserType: async (data: any) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/user-types`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await handleApiResponse(response);
  },

  updateUserType: async (id: number, data: any) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/user-types/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await handleApiResponse(response);
  },

  deleteUserType: async (id: number) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/user-types/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return await handleApiResponse(response);
  },

  // Patient Sources
  getPatientSources: async () => {
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/patient-source`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getPatientSources error:', error);
      return [];
    }
  },

  createPatientSource: async (data: any) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/patient-source`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await handleApiResponse(response);
  },

  updatePatientSource: async (id: number, data: any) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/patient-source/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await handleApiResponse(response);
  },

  deletePatientSource: async (id: number) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/patient-source/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return await handleApiResponse(response);
  },

  // Medical History
  getMedicalHistory: async () => {
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/medical-history`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getMedicalHistory error:', error);
      return [];
    }
  },

  createMedicalHistory: async (data: any) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/medical-history`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await handleApiResponse(response);
  },

  updateMedicalHistory: async (id: number, data: any) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/medical-history/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await handleApiResponse(response);
  },

  // Medical History Options
  getMedicalHistoryOptions: async (historyId: number) => {
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/medical-history-options/${historyId}`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getMedicalHistoryOptions error:', error);
      return [];
    }
  },

  createMedicalHistoryOption: async (data: any) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/medical-history-options`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await handleApiResponse(response);
  },

  updateMedicalHistoryOption: async (id: number, data: any) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/medical-history-options/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await handleApiResponse(response);
  },

  getAllMedicalHistoryOptions: async () => {
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/medical-history-options`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getAllMedicalHistoryOptions error:', error);
      return [];
    }
  },

  // Personal History
  getPersonalHistory: async () => {
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/personal-history`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getPersonalHistory error:', error);
      return [];
    }
  },

  createPersonalHistory: async (data: any) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/personal-history`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await handleApiResponse(response);
  },

  updatePersonalHistory: async (id: number, data: any) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/personal-history/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await handleApiResponse(response);
  },

  // Personal History Options
  getPersonalHistoryOptions: async (historyId: number) => {
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/personal-history-options/${historyId}`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getPersonalHistoryOptions error:', error);
      return [];
    }
  },

  createPersonalHistoryOption: async (data: any) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/personal-history-options`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await handleApiResponse(response);
  },

  updatePersonalHistoryOption: async (id: number, data: any) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/personal-history-options/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await handleApiResponse(response);
  },

  getAllPersonalHistoryOptions: async () => {
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/personal-history-options`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getAllPersonalHistoryOptions error:', error);
      return [];
    }
  },

  // Lifestyle
  getLifestyle: async () => {
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/lifestyle`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getLifestyle error:', error);
      return [];
    }
  },

  createLifestyle: async (data: any) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/lifestyle`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await handleApiResponse(response);
  },

  updateLifestyle: async (id: number, data: any) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/lifestyle/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await handleApiResponse(response);
  },

  // Lifestyle Options
  getLifestyleOptions: async (lifestyleId: number) => {
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/lifestyle-options/${lifestyleId}`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getLifestyleOptions error:', error);
      return [];
    }
  },

  createLifestyleOption: async (data: any) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/lifestyle-options`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await handleApiResponse(response);
  },

  updateLifestyleOption: async (id: number, data: any) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/lifestyle-options/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await handleApiResponse(response);
  },

  getAllLifestyleOptions: async () => {
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/lifestyle-options`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getAllLifestyleOptions error:', error);
      return [];
    }
  },

  // Family History
  getFamilyHistory: async () => {
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/family-history`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getFamilyHistory error:', error);
      return [];
    }
  },

  createFamilyHistory: async (data: any) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/family-history`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await handleApiResponse(response);
  },

  updateFamilyHistory: async (id: number, data: any) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/family-history/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await handleApiResponse(response);
  },

  // Family History Options
  getFamilyHistoryOptions: async (familyHistoryId: number) => {
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/family-history-options/${familyHistoryId}`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getFamilyHistoryOptions error:', error);
      return [];
    }
  },

  createFamilyHistoryOption: async (data: any) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/family-history-options`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await handleApiResponse(response);
  },

  updateFamilyHistoryOption: async (id: number, data: any) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/family-history-options/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await handleApiResponse(response);
  },

  getAllFamilyHistoryOptions: async () => {
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/family-history-options`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getAllFamilyHistoryOptions error:', error);
      return [];
    }
  },

  // Drug History
  getDrugHistory: async () => {
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/drug-history`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getDrugHistory error:', error);
      return [];
    }
  },

  createDrugHistory: async (data: any) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/drug-history`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await handleApiResponse(response);
  },

  updateDrugHistory: async (id: number, data: any) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/drug-history/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await handleApiResponse(response);
  },

  // Drug History Options
  getDrugHistoryOptions: async (drugHistoryId: number) => {
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/drug-history-options/${drugHistoryId}`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getDrugHistoryOptions error:', error);
      return [];
    }
  },

  createDrugHistoryOption: async (data: any) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/drug-history-options`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await handleApiResponse(response);
  },

  updateDrugHistoryOption: async (id: number, data: any) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/drug-history-options/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await handleApiResponse(response);
  },

  getAllDrugHistoryOptions: async () => {
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/drug-history-options`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getAllDrugHistoryOptions error:', error);
      return [];
    }
  },

  // Allergies
  getAllergies: async () => {
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/allergies`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getAllergies error:', error);
      return [];
    }
  },

  createAllergy: async (data: any) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/allergies`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await handleApiResponse(response);
  },

  updateAllergy: async (id: number, data: any) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/allergies/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await handleApiResponse(response);
  },

  // Allergies Options
  getAllergiesOptions: async (allergyId: number) => {
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/allergies-options/${allergyId}`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getAllergiesOptions error:', error);
      return [];
    }
  },

  createAllergyOption: async (data: any) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/allergies-options`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await handleApiResponse(response);
  },

  updateAllergyOption: async (id: number, data: any) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/allergies-options/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await handleApiResponse(response);
  },

  getAllAllergiesOptions: async () => {
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/allergies-options`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getAllAllergiesOptions error:', error);
      return [];
    }
  },

  // Social History
  getSocialHistory: async () => {
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/social-history`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getSocialHistory error:', error);
      return [];
    }
  },

  createSocialHistory: async (data: any) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/social-history`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await handleApiResponse(response);
  },

  updateSocialHistory: async (id: number, data: any) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/social-history/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await handleApiResponse(response);
  },

  // Social History Options
  getSocialHistoryOptions: async (socialHistoryId: number) => {
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/social-history-options/${socialHistoryId}`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getSocialHistoryOptions error:', error);
      return [];
    }
  },

  createSocialHistoryOption: async (data: any) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/social-history-options`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await handleApiResponse(response);
  },

  updateSocialHistoryOption: async (id: number, data: any) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/social-history-options/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await handleApiResponse(response);
  },

  getAllSocialHistoryOptions: async () => {
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/social-history-options`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getAllSocialHistoryOptions error:', error);
      return [];
    }
  },

  // Medication Type
  getMedicationType: async () => {
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/medication-type`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getMedicationType error:', error);
      return [];
    }
  },

  createMedicationType: async (data: any) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/medication-type`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await handleApiResponse(response);
  },

  updateMedicationType: async (id: number, data: any) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/medication-type/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await handleApiResponse(response);
  },

  // Medicine
  getMedicine: async () => {
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/medicine`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getMedicine error:', error);
      return [];
    }
  },

  createMedicine: async (data: any) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/medicine`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await handleApiResponse(response);
  },

  updateMedicine: async (id: number, data: any) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/medicine/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await handleApiResponse(response);
  },

  // Potency
  getPotency: async () => {
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/potency`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getPotency error:', error);
      return [];
    }
  },

  createPotency: async (data: any) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/potency`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await handleApiResponse(response);
  },

  updatePotency: async (id: number, data: any) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/potency/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await handleApiResponse(response);
  },

  // Dosage
  getDosage: async () => {
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/dosage`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getDosage error:', error);
      return [];
    }
  },

  createDosage: async (data: any) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/dosage`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await handleApiResponse(response);
  },

  updateDosage: async (id: number, data: any) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/dosage/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await handleApiResponse(response);
  },

  // Pharmacy
  getPharmacyPrescriptions: async () => {
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/pharmacy/prescriptions`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getPharmacyPrescriptions error:', error);
      return [];
    }
  },

  updatePrescriptionStatus: async (prescriptionId: number, status: number) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/pharmacy/prescriptions/${prescriptionId}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    return await handleApiResponse(response);
  },

  // Patient Examination
  getPatientExaminations: async (locationId?: number, page = 1, limit = 10, fromDate?: string, toDate?: string, search?: string, sortField?: string, sortOrder?: string) => {
    try {
      const params = new URLSearchParams()
      if (locationId) params.append('location_id', locationId.toString())
      params.append('page', page.toString())
      params.append('limit', limit.toString())
      if (fromDate) params.append('from_date', fromDate)
      if (toDate) params.append('to_date', toDate)
      if (search) params.append('search', search)
      if (sortField) params.append('sort_field', sortField)
      if (sortOrder) params.append('sort_order', sortOrder)

      const response = await fetch(`${authService.getSettingsApiUrl()}/patient-examinations?${params.toString()}`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getPatientExaminations error:', error);
      return { data: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0, hasNext: false, hasPrev: false } };
    }
  },

  // Payment Type
  getPaymentTypes: async () => {
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/payment-type`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getPaymentTypes error:', error);
      return [];
    }
  },

  createPaymentType: async (data: any) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/payment-type`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await handleApiResponse(response);
  },

  updatePaymentType: async (id: number, data: any) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/payment-type/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await handleApiResponse(response);
  },

  deletePaymentType: async (id: number) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/payment-type/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return await handleApiResponse(response);
  },

  // Renewal Patients
  getRenewalPatients: async (locationId?: number, fromDate?: string, toDate?: string, search?: string, page: number = 1, limit: number = 10) => {
    try {
      const params = new URLSearchParams();
      if (locationId) params.append('locationId', locationId.toString());
      if (fromDate) params.append('fromDate', fromDate);
      if (toDate) params.append('toDate', toDate);
      if (search) params.append('search', search);
      params.append('page', page.toString());
      params.append('limit', limit.toString());

      const response = await fetch(`${authService.getSettingsApiUrl()}/renewal/patients?${params}`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getRenewalPatients error:', error);
      return [];
    }
  },

  // Expense Categories
  getExpenseCategories: async () => {
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/expense-categories`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getExpenseCategories error:', error);
      return [];
    }
  },

  createExpenseCategory: async (data: any) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/expense-categories`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await handleApiResponse(response);
  },

  updateExpenseCategory: async (id: number, data: any) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/expense-categories/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await handleApiResponse(response);
  },

  deleteExpenseCategory: async (id: number) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/expense-categories/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return await handleApiResponse(response);
  },

  // Employee Expenses
  getAllEmployeeExpenses: async (filters?: { fromDate?: string; toDate?: string; page?: number; limit?: number }) => {
    try {
      const params = new URLSearchParams();
      if (filters?.fromDate) params.append('fromDate', filters.fromDate);
      if (filters?.toDate) params.append('toDate', filters.toDate);
      params.append('page', (filters?.page || 1).toString());
      params.append('limit', (filters?.limit || 10).toString());

      const queryString = params.toString();
      const url = `${authService.getSettingsApiUrl()}/employee-expenses/all${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(url, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getAllEmployeeExpenses error:', error);
      return { data: [], total: 0, page: 1, limit: 10, totalPages: 0 };
    }
  },

  updateExpenseStatus: async (expenseId: number, status: string, rejectionReason?: string) => {
    try {
      const body: any = { status };
      if (rejectionReason) {
        body.rejectionReason = rejectionReason;
      }

      const response = await fetch(`${authService.getSettingsApiUrl()}/employee-expenses/update-status/${expenseId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(body),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('updateExpenseStatus error:', error);
      throw error;
    }
  },

  // Today Collections
  getTodayCollections: async (locationId?: number, fromDate?: string, toDate?: string) => {
    try {
      const params = new URLSearchParams();
      if (locationId) params.append('locationId', locationId.toString());
      if (fromDate) params.append('fromDate', fromDate);
      if (toDate) params.append('toDate', toDate);

      const queryString = params.toString();
      const url = `${authService.getSettingsApiUrl()}/today-collections${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(url, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getTodayCollections error:', error);
      return [];
    }
  },

  // Cash Collections
  getCashCollections: async (locationId?: number, page: number = 1, limit: number = 10, fromDate?: string, toDate?: string) => {
    try {
      const params = new URLSearchParams();
      if (locationId) params.append('locationId', locationId.toString());
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      if (fromDate) params.append('fromDate', fromDate);
      if (toDate) params.append('toDate', toDate);

      const queryString = params.toString();
      const url = `${authService.getSettingsApiUrl()}/cash-collections${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(url, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getCashCollections error:', error);
      return { data: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0, hasNext: false, hasPrev: false } };
    }
  },

  // Approved Expenses by Location
  getApprovedExpensesByLocation: async (locationId?: number) => {
    try {
      const params = new URLSearchParams();
      if (locationId) params.append('locationId', locationId.toString());
      params.append('status', 'approved');

      const response = await fetch(`${authService.getSettingsApiUrl()}/employee-expenses/location?${params}`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getApprovedExpensesByLocation error:', error);
      return [];
    }
  },

  // Patients
  getPatients: async (patientSourceId?: number, fromDate?: string, toDate?: string, page?: number, limit?: number) => {
    try {
      const params = new URLSearchParams();
      if (patientSourceId) params.append('patient_source_id', patientSourceId.toString());
      if (fromDate) params.append('from_date', fromDate);
      if (toDate) params.append('to_date', toDate);
      if (page) params.append('page', page.toString());
      if (limit) params.append('limit', limit.toString());

      const response = await fetch(`${authService.getSettingsApiUrl()}/patients?${params}`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getPatients error:', error);
      return [];
    }
  },

  // System Settings
  getSettings: async () => {
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/system-settings`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getSettings error:', error);
      throw error;
    }
  },

  updateSettings: async (settings: any) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/system-settings`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(settings),
    });
    return await handleApiResponse(response);
  },

  // HR Policies
  createHRPolicy: async (data: any) => {
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/hr-policies`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('createHRPolicy error:', error);
      throw error;
    }
  },

  getHRPolicies: async (params: { page?: number; limit?: number; search?: string } = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.search) queryParams.append('search', params.search);

      const response = await fetch(`${authService.getSettingsApiUrl()}/hr-policies?${queryParams.toString()}`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getHRPolicies error:', error);
      return { data: [], total: 0, page: 1, limit: 10, totalPages: 0 };
    }
  },

  getHRPolicy: async (id: number) => {
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/hr-policies/${id}`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getHRPolicy error:', error);
      throw error;
    }
  },

  updateHRPolicy: async (id: number, data: any) => {
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/hr-policies/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('updateHRPolicy error:', error);
      throw error;
    }
  },

  deleteHRPolicy: async (id: number) => {
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/hr-policies/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('deleteHRPolicy error:', error);
      throw error;
    }
  },

  bulkUploadHRPolicies: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const headers: any = getAuthHeaders();
      delete headers['Content-Type'];

      const response = await fetch(`${authService.getSettingsApiUrl()}/hr-policies/bulk-upload`, {
        method: 'POST',
        headers: headers,
        body: formData,
      });

      return await handleApiResponse(response);
    } catch (error) {
      console.error('bulkUploadHRPolicies error:', error);
      throw error;
    }
  },

  downloadHRPoliciesSample: async () => {
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/hr-policies/sample-excel`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) throw new Error('Failed to download sample file');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'hr_policies_sample.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('downloadHRPoliciesSample error:', error);
      throw error;
    }
  },

  // Employee Expenses
  getEmployeeExpenses: async (locationId?: number) => {
    try {
      const params = new URLSearchParams();
      if (locationId) params.append('location_id', locationId.toString());

      const response = await fetch(`${authService.getSettingsApiUrl()}/employee-expenses?${params.toString()}`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getEmployeeExpenses error:', error);
      throw error;
    }
  },

  getAcceptedPolicies: async (userId: number) => {
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/hr-policies/accepted-policies?userId=${userId}`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error("getAcceptedPolicies error:", error);
      return [];
    }
  },

  acceptHRPolicy: async (data: { userId: number; policyId: number; locationId: number }) => {
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/hr-policies/accept`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error("acceptHRPolicy error:", error);
      throw error;
    }
  },

  // Medicine Days
  getMedicineDays: async () => {
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/medicine-days`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getMedicineDays error:', error);
      return [];
    }
  },

  createMedicineDay: async (data: any) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/medicine-days`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await handleApiResponse(response);
  },

  updateMedicineDay: async (id: number, data: any) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/medicine-days/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await handleApiResponse(response);
  },

  deleteMedicineDay: async (id: number) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/medicine-days/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return await handleApiResponse(response);
  },

  // Appointment Types
  getAppointmentTypes: async (locationId?: number) => {
    try {
      const params = new URLSearchParams();
      if (locationId) params.append('locationId', locationId.toString());
      const response = await fetch(`${authService.getSettingsApiUrl()}/appointment-types?${params}`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getAppointmentTypes error:', error);
      return [];
    }
  },

  createAppointmentType: async (data: any) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/appointment-types`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await handleApiResponse(response);
  },

  updateAppointmentType: async (id: number, data: any) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/appointment-types/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await handleApiResponse(response);
  },

  deleteAppointmentType: async (id: number) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/appointment-types/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return await handleApiResponse(response);
  },

  // Treatments
  getTreatments: async () => {
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/settings/treatments`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getTreatments error:', error);
      return [];
    }
  },

  getTreatment: async (id: number) => {
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/settings/treatments/${id}`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getTreatment error:', error);
      throw error;
    }
  },

  createTreatment: async (data: any) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/settings/treatments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await handleApiResponse(response);
  },

  updateTreatment: async (id: number, data: any) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/settings/treatments/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await handleApiResponse(response);
  },

  deleteTreatment: async (id: number) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/settings/treatments/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return await handleApiResponse(response);
  },

  uploadTreatmentImage: async (file: File) => {
    const url = `${authService.getSettingsApiUrl()}/settings/treatments/upload-image`;
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: getAuthHeaders().Authorization,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to upload image");
    }

    return response.json();
  },

  getPublicTreatments: async () => {
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/public-treatments`);
      if (!response.ok) {
        throw new Error(`Public API Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('getPublicTreatments error:', error);
      return [];
    }
  },

  getPublicTreatmentBySlug: async (slug: string) => {
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/public-treatments/${slug}`);
      if (!response.ok) {
        throw new Error(`Public Detail API Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('getPublicTreatmentBySlug error:', error);
      return null;
    }
  },

  // Blogs
  getBlogs: async () => {
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/settings/blogs`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getBlogs error:', error);
      return [];
    }
  },

  getBlog: async (id: number) => {
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/settings/blogs/${id}`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getBlog error:', error);
      throw error;
    }
  },

  createBlog: async (data: any) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/settings/blogs`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await handleApiResponse(response);
  },

  updateBlog: async (id: number, data: any) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/settings/blogs/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await handleApiResponse(response);
  },

  deleteBlog: async (id: number) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/settings/blogs/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return await handleApiResponse(response);
  },

  uploadBlogImage: async (file: File) => {
    const url = `${authService.getSettingsApiUrl()}/settings/blogs/upload-image`;
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: getAuthHeaders().Authorization,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to upload image");
    }

    return response.json();
  },

  // Google Reviews (Admin)
  getGoogleReviews: async (page = 1, limit = 10) => {
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/settings/google-reviews?page=${page}&limit=${limit}`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getGoogleReviews error:', error);
      return { data: [], total: 0, page: 1, limit: 10 };
    }
  },

  getGoogleReview: async (id: number) => {
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/settings/google-reviews/${id}`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getGoogleReview error:', error);
      throw error;
    }
  },

  createGoogleReview: async (data: any) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/settings/google-reviews`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await handleApiResponse(response);
  },

  updateGoogleReview: async (id: number, data: any) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/settings/google-reviews/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await handleApiResponse(response);
  },

  deleteGoogleReview: async (id: number) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/settings/google-reviews/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return await handleApiResponse(response);
  },

  // Public Google Reviews (Frontend)
  getPublicGoogleReviews: async () => {
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/public/google-reviews`);
      if (!response.ok) throw new Error('Failed to fetch public reviews');
      return await response.json();
    } catch (error) {
      console.error('getPublicGoogleReviews error:', error);
      return { Miryalaguda: [], Narasaraopet: [], Ongole: [] };
    }
  },


  getPublicBlogs: async (limit?: number, offset?: number) => {
    try {
      let url = `${authService.getSettingsApiUrl()}/public-blogs`;
      const params = new URLSearchParams();
      if (limit !== undefined) params.append('limit', limit.toString());
      if (offset !== undefined) params.append('offset', offset.toString());
      
      const queryString = params.toString();
      if (queryString) url += `?${queryString}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Public API Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('getPublicBlogs error:', error);
      return [];
    }
  },

  getPublicBlogByTitle: async (title: string) => {
    try {
      const url = `${authService.getSettingsApiUrl()}/public-blogs/detail/${encodeURIComponent(title)}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Public Detail API Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('getPublicBlogByTitle error:', error);
      return null;
    }
  },

  // About Content
  getAbout: async () => {
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/about`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getAbout error:', error);
      return [];
    }
  },

  getPublicAbout: async () => {
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/public-about`);
      if (!response.ok) {
        throw new Error(`Public About API Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('getPublicAbout error:', error);
      return null;
    }
  },

  createAbout: async (data: any) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/about`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await handleApiResponse(response);
  },

  updateAbout: async (id: number, data: any) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/about/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await handleApiResponse(response);
  },

  deleteAbout: async (id: number) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/about/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return await handleApiResponse(response);
  },

  uploadAboutImages: async (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    const token = localStorage.getItem('authToken');
    const response = await fetch(`${authService.getSettingsApiUrl()}/about/upload-images`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Upload failed: ${errorText}`);
    }

    return await response.json();
  },

  // Branches (Clinics)
  getBranches: async () => {
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/settings/branches`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getBranches error:', error);
      return [];
    }
  },

  getPublicBranches: async () => {
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/public/branches`);
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getPublicBranches error:', error);
      return [];
    }
  },

  getBranch: async (id: number) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/settings/branches/${id}`, {
      headers: getAuthHeaders(),
    });
    return await handleApiResponse(response);
  },

  getPublicBranchBySlug: async (slug: string) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/public/branches/${slug}`);
    return await handleApiResponse(response);
  },

  createBranch: async (data: any) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/settings/branches`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await handleApiResponse(response);
  },

  updateBranch: async (id: number, data: any) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/settings/branches/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await handleApiResponse(response);
  },

  deleteBranch: async (id: number) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/settings/branches/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return response.ok;
  },

  uploadBranchImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await fetch(`${authService.getSettingsApiUrl()}/settings/branches/upload-image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
      body: formData,
    });
    return await handleApiResponse(response);
  },

  // Hero Sections
  getHeroSections: async () => {
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/public/hero-sections`);
      if (!response.ok) throw new Error('Failed to fetch hero sections');
      return await response.json();
    } catch (error) {
      console.error('getHeroSections error:', error);
      return [];
    }
  },

  getAdminHeroSections: async () => {
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/settings/hero-sections`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getAdminHeroSections error:', error);
      return [];
    }
  },

  getHeroSection: async (id: number) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/settings/hero-sections/${id}`, {
      headers: getAuthHeaders(),
    });
    return await handleApiResponse(response);
  },

  createHeroSection: async (data: any) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/settings/hero-sections`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await handleApiResponse(response);
  },

  updateHeroSection: async (id: number, data: any) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/settings/hero-sections/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return await handleApiResponse(response);
  },

  deleteHeroSection: async (id: number) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/settings/hero-sections/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return response.ok;
  },

  uploadHeroImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await fetch(`${authService.getSettingsApiUrl()}/settings/hero-sections/upload-image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
      body: formData,
    });
    return await handleApiResponse(response);
  },

  seedHeroSections: async () => {
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/public/hero-sections/seed`, {
        method: 'POST',
      });
      return response.ok;
    } catch (error) {
      console.error('seedHeroSections error:', error);
      return false;
    }
  },

  getExternalReviews: async () => {
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/public/reviews/external`);
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getExternalReviews error:', error);
      return [];
    }
  },
};


// Type definitions
export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  roleId: number;
  departmentId?: number;
  locationId?: string;
  isActive: boolean;
  userType?: string;
  roleName?: string;
  departmentName?: string;
  locationNames?: string;
}

export interface UserType {
  id: string;
  name: string;
}

export interface Role {
  id: number;
  name: string;
  code?: string;
  locationId?: number;
  isActive: number | string;
  userCount?: number;
  modules?: string[];
  description?: string;
}

export interface ApprovedExpense {
  id: number;
  amount: number;
  description?: string;
  expenseDate: string;
  status: string;
  expenseCategory: {
    id: number;
    name: string;
  };
  employee: {
    id: number;
    firstName: string;
    lastName: string;
  };
}

export interface LocationsIp {
  id: number;
  ip: string;
  locationId: number;
  status: string;
  createdBy?: number;
  createdAt: string;
  updatedAt: string;
};

export interface SystemSettings {
  general: {
    hospital_name: string;
    hospital_heading: string;
    hospital_logo: string;
    timezone: string;
    currency: string;
    dateFormat: string;
  };
  security: {
    passwordMinLength: number;
    requireUppercase: boolean;
    requireNumbers: boolean;
    requireSymbols: boolean;
    sessionTimeout: number;
    maxLoginAttempts: number;
    enable2FA: boolean;
  };
  notifications: {
    emailEnabled: boolean;
    smsEnabled: boolean;
    pushEnabled: boolean;
    emailFrom: string;
  };
  system: {
    maintenanceMode: boolean;
    backupFrequency: string;
    maxFileUploadSize: number;
    enableAuditLogs: boolean;
  };
}

export default settingsApi;