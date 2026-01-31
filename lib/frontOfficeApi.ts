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

export interface Gender {
  id: number;
  code: string;
  name: string;
  description?: string;
  is_active: boolean;
}

export interface BloodGroup {
  id: number;
  code: string;
  name: string;
  description?: string;
  is_active: boolean;
}

export interface MaritalStatus {
  id: number;
  code: string;
  name: string;
  description?: string;
  is_active: boolean;
}

export interface ConsultationType {
  id: number;
  code: string;
  name: string;
  description?: string;
  fee_amount: number;
  is_active: boolean;
}

export interface VisitType {
  id: number;
  code: string;
  name: string;
  description?: string;
  is_active: boolean;
}

export interface PatientCategory {
  id: number;
  code: string;
  name: string;
  description?: string;
  requires_company_details: boolean;
  is_active: boolean;
}

export interface PatientSource {
  id: number;
  title: string;
  code: string;
  status: boolean;
  created_at: string;
  updated_at: string;
}

export interface FeeMasters {
  id: number;
  title: string;
  code: string;
  amount: number;
  status: boolean;
  created_at: string;
  updated_at: string;
}

export interface PatientVitals {
  id?: number;
  patientId: number;
  vitalsTemperature?: number;
  vitalsBloodPressure?: string;
  vitalsHeartRate?: number;
  vitalsO2Saturation?: number;
  createdAt?: string;
  updatedAt?: string;
}

export const frontOfficeApi = {
  searchPatients: async (query: string): Promise<any[]> => {
    try {
      const response = await fetch(
        `${authService.getFrontOfficeApiUrl()}/front-office/api/patients/search`,
        {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({ query }),
        }
      );
      return await handleApiResponse(response);
    } catch (error) {
      console.error('searchPatients error:', error);
      return [];
    }
  },

  getGenders: async (): Promise<Gender[]> => {
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/gender`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getGenders error:', error);
      return [];
    }
  },

  getBloodGroups: async (): Promise<BloodGroup[]> => {
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/blood-group`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getBloodGroups error:', error);
      return [];
    }
  },

  getMaritalStatuses: async (): Promise<MaritalStatus[]> => {
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/marital-status`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getMaritalStatuses error:', error);
      return [];
    }
  },

  getPatientSources: async (): Promise<PatientSource[]> => {
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

  getFeeMasters: async (): Promise<FeeMasters[]> => {
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/fee-masters`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getFeeMasters error:', error);
      return [];
    }
  },

  getConsultationTypes: async (): Promise<ConsultationType[]> => {
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/consultation-types`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getConsultationTypes error:', error);
      return [];
    }
  },

  savePatientVitals: async (vitalsData: PatientVitals): Promise<PatientVitals> => {
    try {
      const response = await fetch(
        `${authService.getFrontOfficeApiUrl()}/front-office/api/patient-prescriptions/vitals`,
        {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(vitalsData),
        }
      );
      return await handleApiResponse(response);
    } catch (error) {
      console.error('savePatientVitals error:', error);
      throw error;
    }
  },

  getPatientVitals: async (patientId: number): Promise<PatientVitals[]> => {
    try {
      const response = await fetch(
        `${authService.getFrontOfficeApiUrl()}/front-office/api/patient-prescriptions/${patientId}/vitals`,
        {
          headers: getAuthHeaders(),
        }
      );
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getPatientVitals error:', error);
      return [];
    }
  },

  getAppointments: async (filters?: {
    date?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<any> => {
    try {
      const params = new URLSearchParams();
      if (filters?.date) params.append('date', filters.date);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.search) params.append('search', filters.search);
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());

      const response = await fetch(
        `${authService.getSettingsApiUrl()}/appointments?${params.toString()}`,
        {
          headers: getAuthHeaders(),
        }
      );
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getAppointments error:', error);
      return { data: [], total: 0, page: 1, limit: 50, totalPages: 0 };
    }
  },

  createAppointment: async (appointmentData: any): Promise<any> => {
    try {
      const response = await fetch(
        `${authService.getSettingsApiUrl()}/appointments`,
        {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(appointmentData),
        }
      );
      return await handleApiResponse(response);
    } catch (error) {
      console.error('createAppointment error:', error);
      throw error;
    }
  },

  getPatientsBySource: async (patientSourceId: number, fromDate?: string, toDate?: string): Promise<any[]> => {
    try {
      const params = new URLSearchParams();
      params.append('patient_source_id', patientSourceId.toString());
      if (fromDate) params.append('from_date', fromDate);
      if (toDate) params.append('to_date', toDate);
      
      const response = await fetch(
        `${authService.getSettingsApiUrl()}/patients?${params.toString()}`,
        {
          headers: getAuthHeaders(),
        }
      );
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getPatientsBySource error:', error);
      return [];
    }
  },
};