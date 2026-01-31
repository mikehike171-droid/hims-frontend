// Settings Microservice API
import authService from './authService';

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

const handleApiResponse = async (response: Response) => {
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
  getMedicalHistory: async (locationId?: number) => {
    try {
      const params = locationId ? `?location_id=${locationId}` : '';
      const response = await fetch(`${authService.getSettingsApiUrl()}/medical-history${params}`, {
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
  getPersonalHistory: async (locationId?: number) => {
    try {
      const params = locationId ? `?location_id=${locationId}` : '';
      const response = await fetch(`${authService.getSettingsApiUrl()}/personal-history${params}`, {
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
  getLifestyle: async (locationId?: number) => {
    try {
      const params = locationId ? `?location_id=${locationId}` : '';
      const response = await fetch(`${authService.getSettingsApiUrl()}/lifestyle${params}`, {
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
  getFamilyHistory: async (locationId?: number) => {
    try {
      const params = locationId ? `?location_id=${locationId}` : '';
      const response = await fetch(`${authService.getSettingsApiUrl()}/family-history${params}`, {
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
  getDrugHistory: async (locationId?: number) => {
    try {
      const params = locationId ? `?location_id=${locationId}` : '';
      const response = await fetch(`${authService.getSettingsApiUrl()}/drug-history${params}`, {
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
  getAllergies: async (locationId?: number) => {
    try {
      const params = locationId ? `?location_id=${locationId}` : '';
      const response = await fetch(`${authService.getSettingsApiUrl()}/allergies${params}`, {
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
  getSocialHistory: async (locationId?: number) => {
    try {
      const params = locationId ? `?location_id=${locationId}` : '';
      const response = await fetch(`${authService.getSettingsApiUrl()}/social-history${params}`, {
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
  getMedicationType: async (locationId?: number) => {
    try {
      const params = locationId ? `?location_id=${locationId}` : '';
      const response = await fetch(`${authService.getSettingsApiUrl()}/medication-type${params}`, {
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
  getMedicine: async (locationId?: number) => {
    try {
      const params = locationId ? `?location_id=${locationId}` : '';
      const response = await fetch(`${authService.getSettingsApiUrl()}/medicine${params}`, {
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
  getPotency: async (locationId?: number) => {
    try {
      const params = locationId ? `?location_id=${locationId}` : '';
      const response = await fetch(`${authService.getSettingsApiUrl()}/potency${params}`, {
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
  getDosage: async (locationId?: number) => {
    try {
      const params = locationId ? `?location_id=${locationId}` : '';
      const response = await fetch(`${authService.getSettingsApiUrl()}/dosage${params}`, {
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
  getPharmacyPrescriptions: async (locationId?: number) => {
    try {
      const params = locationId ? `?location_id=${locationId}` : '';
      const response = await fetch(`${authService.getSettingsApiUrl()}/pharmacy/prescriptions${params}`, {
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
  getPatientExaminations: async (locationId?: number, page = 1, limit = 10, fromDate?: string, toDate?: string) => {
    try {
      const params = new URLSearchParams();
      if (locationId) params.append('location_id', locationId.toString());
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      if (fromDate) params.append('from_date', fromDate);
      if (toDate) params.append('to_date', toDate);
      
      const response = await fetch(`${authService.getSettingsApiUrl()}/patient-examinations?${params}`, {
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
  getRenewalPatients: async (locationId?: number, fromDate?: string, toDate?: string) => {
    try {
      const params = new URLSearchParams();
      if (locationId) params.append('locationId', locationId.toString());
      if (fromDate) params.append('fromDate', fromDate);
      if (toDate) params.append('toDate', toDate);
      
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

  // Employee Expenses
  getAllEmployeeExpenses: async (filters?: { fromDate?: string; toDate?: string }) => {
    try {
      const params = new URLSearchParams();
      if (filters?.fromDate) params.append('fromDate', filters.fromDate);
      if (filters?.toDate) params.append('toDate', filters.toDate);
      
      const queryString = params.toString();
      const url = `${authService.getSettingsApiUrl()}/employee-expenses/all${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getAllEmployeeExpenses error:', error);
      return [];
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
  getCashCollections: async (locationId?: number, page: number = 1, limit: number = 10) => {
    try {
      const params = new URLSearchParams();
      if (locationId) params.append('locationId', locationId.toString());
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      
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
  getPatients: async (patientSourceId?: number, fromDate?: string, toDate?: string) => {
    try {
      const params = new URLSearchParams();
      if (patientSourceId) params.append('patient_source_id', patientSourceId.toString());
      if (fromDate) params.append('from_date', fromDate);
      if (toDate) params.append('to_date', toDate);
      
      const response = await fetch(`${authService.getApiUrl()}/patients?${params}`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getPatients error:', error);
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

export default settingsApi;