// Doctors API (now part of Settings Service)
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

export const doctorsApi = {
  // Doctors
  getDoctors: async (locationId?: number) => {
    try {
      const params = locationId ? `?locationId=${locationId}` : '';
      const response = await fetch(`${authService.getSettingsApiUrl()}/doctors/users${params}`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getDoctors error:', error);
      return [];
    }
  },

  // Doctor Timeslots
  getDoctorTimeslots: async (locationId?: number) => {
    try {
      const params = locationId ? `?locationId=${locationId}` : '';
      const response = await fetch(`${authService.getSettingsApiUrl()}/doctors/timeslots${params}`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getDoctorTimeslots error:', error);
      return [];
    }
  },

  createBulkTimeslots: async (timeslotData: {
    userId: number;
    date: string;
    fromTime: string;
    toTime: string;
    duration: number;
    locationId: number;
  }) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/doctors/timeslots/bulk`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(timeslotData),
    });
    return response.json();
  },

  getAllDoctorTimeslots: async (locationId?: number) => {
    try {
      const params = locationId ? `?locationId=${locationId}` : '';
      const response = await fetch(`${authService.getSettingsApiUrl()}/doctors/timeslots/all${params}`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getAllDoctorTimeslots error:', error);
      return [];
    }
  },

  updateTimeslotStatus: async (id: number, isActive: boolean) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/doctors/timeslots/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ isActive }),
    });
    return response.json();
  },

  // Consultation Fees
  getConsultationFees: async (locationId?: number) => {
    try {
      const params = locationId ? `?locationId=${locationId}` : '';
      const response = await fetch(`${authService.getSettingsApiUrl()}/doctors/consultation-fees${params}`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getConsultationFees error:', error);
      return [];
    }
  },

  createConsultationFee: async (data: { userId: number; cashFee: number; locationId: number; departmentId: number }) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/doctors/consultation-fees`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  updateConsultationFee: async (id: number, data: { userId: number; cashFee: number; locationId?: number; departmentId?: number }) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/doctors/consultation-fees/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  deleteConsultationFee: async (id: number) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/doctors/consultation-fees/${id}/delete`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    return response.json();
  },
};

// Type definitions
export interface Doctor {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  departmentId?: number;
  locationId?: number;
  isActive: boolean;
}

export interface DoctorTimeslot {
  id: number;
  userId: number;
  date: string;
  fromTime: string;
  toTime: string;
  duration: number;
  locationId: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ConsultationFee {
  id: number;
  userId: number;
  cashFee: number;
  status: number;
  firstName: string;
  lastName: string;
  departmentName: string;
}

export default doctorsApi;