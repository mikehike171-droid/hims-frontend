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

export const campaignsApi = {
  getCampaigns: async (page = 1, limit = 10, search = '', locationId?: number, fromDate?: string, toDate?: string) => {
    try {
      const params: any = { page: String(page), limit: String(limit) };
      if (search) params.search = search;
      if (locationId) params.locationId = String(locationId);
      if (fromDate && !search) params.fromDate = fromDate;
      if (toDate && !search) params.toDate = toDate;
      
      const query = new URLSearchParams(params);
      const response = await fetch(`${authService.getSettingsApiUrl()}/campaigns?${query.toString()}`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getCampaigns error:', error);
      return { items: [], total: 0, page, limit, totalPages: 0 };
    }
  },

  getCampaign: async (id: number) => {
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/campaigns/${id}`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('getCampaign error:', error);
      return null;
    }
  },

  createCampaign: async (data: any) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/campaigns`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleApiResponse(response);
  },

  updateCampaign: async (id: number, data: any) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/campaigns/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleApiResponse(response);
  },

  deleteCampaign: async (id: number) => {
    const response = await fetch(`${authService.getSettingsApiUrl()}/campaigns/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleApiResponse(response);
  },

  importCampaigns: async (file: File, locationId?: number) => {
    const formData = new FormData();
    formData.append('file', file);
    if (locationId) formData.append('locationId', String(locationId));
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${authService.getSettingsApiUrl()}/campaigns/import`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    return handleApiResponse(response);
  },

  getExportUrl: (locationId?: number) => {
    let url = `${authService.getSettingsApiUrl()}/campaigns/export`;
    if (locationId) url += `?locationId=${locationId}`;
    return url;
  },

  getSampleTemplateUrl: () => {
    return `${authService.getSettingsApiUrl()}/campaigns/sample`;
  }
};
