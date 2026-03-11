import authService from './authService';

const getApiUrl = () => {
  // Use front-office service URL for patient prescriptions
  return `${authService.getFrontOfficeApiUrl()}/front-office/api`;
};

const apiRequest = async (url: string, options: RequestInit = {}) => {
  const token = authService.getCurrentToken();
  
  const response = await fetch(`${getApiUrl()}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw { response: { data: error } };
  }

  return response.json();
};

export interface VitalsData {
  patientId: number
  vitalsTemperature?: number
  vitalsBloodPressure?: string
  vitalsHeartRate?: number
  vitalsO2Saturation?: number
  vitalsRespiratoryRate?: number
  vitalsWeight?: number
  vitalsHeight?: number
  vitalsBloodGlucose?: number
  vitalsPainScale?: number
  nursingNotes?: string
}

export const prescriptionApi = {
  saveVitals: async (vitalsData: VitalsData) => {
    return await apiRequest('/patient-prescriptions/vitals', {
      method: 'POST',
      body: JSON.stringify(vitalsData)
    });
  },

  getPatientVitals: async (patientId: number) => {
    return await apiRequest(`/patient-prescriptions/${patientId}/vitals`);
  }
}