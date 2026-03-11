import authService from './authService';

export interface ExaminationData {
  patientId: string;
  locationId: number;
  pastMedicalReports?: string;
  investigationsRequired?: string;
  physicalExamination?: string;
  bp?: string;
  pulse?: string;
  heartRate?: string;
  weight?: string;
  rr?: string;
  menstrualObstetricHistory?: string;
  treatmentPlanMonthsDoctor?: number;
  nextRenewalDateDoctor?: string;
  treatmentPlanMonthsPro?: number;
  nextRenewalDatePro?: string;
}

export interface PatientExamination extends ExaminationData {
  id: number;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
  // Database field names (snake_case)
  treatment_plan_months_doctor?: number;
  next_renewal_date_doctor?: string;
  treatment_plan_months_pro?: number;
  next_renewal_date_pro?: string;
}

class ExaminationApi {
  private getHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  async createExamination(data: ExaminationData): Promise<PatientExamination> {
    const response = await fetch(`${authService.getSettingsApiUrl()}/patient-examination`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create examination');
    }

    return response.json();
  }

  async getPatientExaminations(patientId: string): Promise<PatientExamination[]> {
    const response = await fetch(`${authService.getSettingsApiUrl()}/patient-examination/${patientId}`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch examinations');
    }

    return response.json();
  }

  async getLatestExamination(patientId: string): Promise<PatientExamination | null> {
    const response = await fetch(`${authService.getSettingsApiUrl()}/patient-examination/${patientId}/latest`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch latest examination');
    }

    return response.json();
  }

  async updateExamination(id: number, data: Partial<ExaminationData>): Promise<PatientExamination> {
    const response = await fetch(`${authService.getSettingsApiUrl()}/patient-examination/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update examination');
    }

    return response.json();
  }

  async deleteExamination(id: number): Promise<void> {
    const response = await fetch(`${authService.getSettingsApiUrl()}/patient-examination/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete examination');
    }
  }
}

export const examinationApi = new ExaminationApi();