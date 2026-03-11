import authService from './authService';

const getApiUrl = () => authService.getSettingsApiUrl();

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

export const attendanceApi = {
  checkInOut: async (userId: number, locationId: number, type: 'check-in' | 'check-out') => {
    return await apiRequest('/attendance/check-in-out', {
      method: 'POST',
      body: JSON.stringify({ userId, locationId, type })
    });
  },

  getTodayAttendance: async (userId: number, locationId: number) => {
    return await apiRequest(`/attendance/user/${userId}/today?locationId=${locationId}`);
  },

  getTotalDuration: async (userId: number, locationId: number, date: string) => {
    return await apiRequest(`/attendance/user/${userId}/duration?locationId=${locationId}&date=${date}`);
  },

  getAll: async (locationId?: number, userId?: number, date?: string, page?: number, limit?: number) => {
    const params = new URLSearchParams();
    if (locationId) params.append('locationId', locationId.toString());
    if (userId) params.append('userId', userId.toString());
    if (date) params.append('date', date);
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    
    return await apiRequest(`/attendance?${params}`);
  },

  getStats: async (userId: number, locationId: number) => {
    return await apiRequest(`/attendance/user/${userId}/stats?locationId=${locationId}`);
  },

  create: async (attendanceData: any) => {
    return await apiRequest('/attendance', {
      method: 'POST',
      body: JSON.stringify(attendanceData)
    });
  },

  updateAvailableStatus: async (userId: number, locationId: number, userStatusId: number) => {
    return await apiRequest('/attendance/available-status', {
      method: 'PATCH',
      body: JSON.stringify({ userId, locationId, userStatusId })
    });
  },

  getAttendanceByDate: async (userId: number, locationId: number, date: string) => {
    return await apiRequest(`/attendance/user/${userId}/date/${date}?locationId=${locationId}`);
  },

  getGroupedAttendance: async (userId: number, locationId: number) => {
    return await apiRequest(`/attendance/user/${userId}/grouped?locationId=${locationId}`);
  },

  getGroupedAttendancePaginated: async (userId: number, locationId: number, page: number, limit: number = 10) => {
    return await apiRequest(`/attendance/user/${userId}/user-leaves?locationId=${locationId}&page=${page}&limit=${limit}`);
  },

  getUserStatuses: async () => {
    return await apiRequest('/user-status');
  },

  getAttendanceReport: async (locationId: number, fromMonth?: string, toMonth?: string, userId?: number, page?: number, limit?: number) => {
    const body: any = { locationId };
    if (fromMonth) body.fromMonth = fromMonth;
    if (toMonth) body.toMonth = toMonth;
    if (userId) body.userId = userId;
    if (page) body.page = page;
    if (limit) body.limit = limit;
   
    return await apiRequest('/attendance/summary', {
      method: 'POST',
      body: JSON.stringify(body)
    });
  },

   getDetailedAttendanceReport: async (locationId: number, fromDate?: string, toDate?: string, userId?: number, departmentId?: number, page?: number, limit?: number) => {
    const body: any = { locationId };
    if (fromDate) body.fromDate = fromDate;
    if (toDate) body.toDate = toDate;
    if (departmentId) body.departmentId = departmentId;
    if (userId) body.userId = userId;
    if (page) body.page = page;
    if (limit) body.limit = limit;
   
    return await apiRequest('/attendance/report', {
      method: 'POST',
      body: JSON.stringify(body)
    });
  },

  searchDoctors: async (searchTerm: string, locationId: number) => {
    return await apiRequest(`/attendance/search?searchTerm=${encodeURIComponent(searchTerm)}&locationId=${locationId}`);
  },

};