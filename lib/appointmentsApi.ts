import authService from './authService';

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const appointmentsApi = {
  getAppointments: async (filters?: {
    fromDate?: string;
    toDate?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
    locationId?: number;
    doctorId?: number;
    user_location_id?: number;
  }) => {
    try {
      const params = new URLSearchParams();
      if (filters?.fromDate) params.append('fromDate', filters.fromDate);
      if (filters?.toDate) params.append('toDate', filters.toDate);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.search) params.append('search', filters.search);
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.locationId) params.append('locationId', filters.locationId.toString());
      if (filters?.doctorId) params.append('doctorId', filters.doctorId.toString());

      const response = await fetch(
        `${authService.getSettingsApiUrl()}/appointments?${params.toString()}`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('getAppointments error:', error);
      return { data: [], total: 0, page: 1, limit: 50, totalPages: 0 };
    }
  },

  getDoctorAppointments: async (doctorId: number, filters?: {
    fromDate?: string;
    toDate?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    try {
      const params = new URLSearchParams();
      if (filters?.fromDate) params.append('fromDate', filters.fromDate);
      if (filters?.toDate) params.append('toDate', filters.toDate);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.search) params.append('search', filters.search);
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());

      const response = await fetch(
        `${authService.getSettingsApiUrl()}/appointments/doctor/${doctorId}?${params.toString()}`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('getDoctorAppointments error:', error);
      return { data: [], total: 0, page: 1, limit: 50, totalPages: 0 };
    }
  },

  createAppointment: async (appointmentData: any) => {
    try {
      const locationId = authService.getLocationId();
      const user = authService.getCurrentUser();
      const payload = {
        ...appointmentData,
        user_location_id: locationId ? parseInt(locationId) : null,
        location_id: locationId ? parseInt(locationId) : null,
        doctor_id: user?.id ? parseInt(user.id) : null
      };

      const response = await fetch(
        `${authService.getSettingsApiUrl()}/appointments`,
        {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('createAppointment error:', error);
      throw error;
    }
  }
};