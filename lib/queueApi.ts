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

export interface Doctor {
  id: number;
  name: string;
  status: string;
  consultingRoom: string;
  currentPatient: string | null;
  isCheckedIn: boolean;
  checkInTime: string | null;
}

export interface QueueData {
  doctorsByDepartment: Record<string, Doctor[]>;
}

export const queueApi = {
  async getDoctorsByDepartment(locationId: number = 1): Promise<QueueData> {
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/queue/doctors?location_id=${locationId}`);
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getDoctorsByDepartment error:', error);
      throw error;
    }
  },
};