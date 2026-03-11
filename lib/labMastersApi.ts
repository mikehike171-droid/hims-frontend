import authService from './authService';

const API_URL = 'http://localhost:3007';

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${authService.getCurrentToken()}`,
});

export interface Unit {
  id: number;
  code: string;
  description: string;
  status: string;
  locationId?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Investigation {
  id: number;
  code: string;
  description: string;
  method?: string;
  unitId?: number;
  unitDescription?: string;
  resultType?: string;
  defaultValue?: string;
  locationId?: number;
  status: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Test {
  id: number;
  code: string;
  name: string;
  category: string;
  department: string;
  sampleType: string;
  method: string;
  units: string;
  referenceRange: string;
  normalRange: string;
  criticalLow: string;
  criticalHigh: string;
  turnaroundTime: number;
  cost: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TestGroup {
  id: number;
  name: string;
  code: string;
  description: string;
  tests: number[];
  cost: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const labMastersApi = {
  // Units
  getUnits: async (locationId?: number): Promise<Unit[]> => {
    let url = `${API_URL}/lab/masters/units`;
    if (locationId) {
      url += `?locationId=${locationId}`;
    }
    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch units: ${response.status}`);
    }
    const data = await response.json();
    return data.map((unit: any) => ({
      id: unit.id,
      code: unit.code,
      description: unit.description,
      status: unit.status,
      isActive: unit.status === '1',
      locationId: unit.locationId,
      createdAt: unit.createdAt,
      updatedAt: unit.updatedAt
    }));
  },

  createUnit: async (unitData: Partial<Unit>): Promise<Unit> => {
    const response = await fetch(`${API_URL}/lab/masters/units`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        code: unitData.code,
        description: unitData.description,
        isActive: unitData.isActive,
        locationId: unitData.locationId
      }),
    });
    if (!response.ok) {
      throw new Error(`Failed to create unit: ${response.status}`);
    }
    const unit = await response.json();
    return {
      ...unit,
      isActive: unit.status === '1'
    };
  },

  updateUnit: async (id: number, unitData: Partial<Unit>): Promise<Unit> => {
    const response = await fetch(`${API_URL}/lab/masters/units/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        code: unitData.code,
        description: unitData.description,
        isActive: unitData.isActive,
        locationId: unitData.locationId
      }),
    });
    if (!response.ok) {
      throw new Error(`Failed to update unit: ${response.status}`);
    }
    const unit = await response.json();
    return {
      ...unit,
      isActive: unit.status === '1'
    };
  },

  deleteUnit: async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/lab/masters/units/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Failed to delete unit: ${response.status}`);
    }
  },

  // Investigations
  getInvestigations: async (locationId?: number): Promise<Investigation[]> => {
    let url = `${API_URL}/lab/masters/investigations`;
    if (locationId) {
      url += `?locationId=${locationId}`;
    }
    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch investigations: ${response.status}`);
    }
    const data = await response.json();
    return data.map((investigation: any) => ({
      id: investigation.id,
      code: investigation.code,
      description: investigation.description,
      method: investigation.method,
      unitId: investigation.unitid,
      unitDescription: investigation.unitdescription,
      resultType: investigation.resulttype,
      defaultValue: investigation.defaultvalue,
      locationId: investigation.locationid,
      status: investigation.status,
      isActive: investigation.status === '1',
      createdAt: investigation.createdat,
      updatedAt: investigation.updatedat
    }));
  },

  createInvestigation: async (investigationData: Partial<Investigation>): Promise<Investigation> => {
    const response = await fetch(`${API_URL}/lab/masters/investigations`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        code: investigationData.code,
        description: investigationData.description,
        method: investigationData.method,
        unitId: investigationData.unitId,
        resultType: investigationData.resultType,
        defaultValue: investigationData.defaultValue,
        locationId: investigationData.locationId,
        isActive: investigationData.isActive
      }),
    });
    if (!response.ok) {
      throw new Error(`Failed to create investigation: ${response.status}`);
    }
    const investigation = await response.json();
    return {
      ...investigation,
      isActive: investigation.status === '1'
    };
  },

  updateInvestigation: async (id: number, investigationData: Partial<Investigation>): Promise<Investigation> => {
    const response = await fetch(`${API_URL}/lab/masters/investigations/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        code: investigationData.code,
        description: investigationData.description,
        method: investigationData.method,
        unitId: investigationData.unitId,
        resultType: investigationData.resultType,
        defaultValue: investigationData.defaultValue,
        locationId: investigationData.locationId,
        isActive: investigationData.isActive
      }),
    });
    if (!response.ok) {
      throw new Error(`Failed to update investigation: ${response.status}`);
    }
    const investigation = await response.json();
    return {
      ...investigation,
      isActive: investigation.status === '1'
    };
  },

  deleteInvestigation: async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/lab/masters/investigations/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Failed to delete investigation: ${response.status}`);
    }
  },

  // Tests
  getTests: async (locationId?: number): Promise<Test[]> => {
    let url = `${API_URL}/lab/masters/tests`;
    if (locationId) {
      url += `?locationId=${locationId}`;
    }
    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch tests: ${response.status}`);
    }
    return response.json();
  },

  createTest: async (testData: Partial<Test>): Promise<Test> => {
    const response = await fetch(`${API_URL}/lab/masters/tests`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(testData),
    });
    if (!response.ok) {
      throw new Error(`Failed to create test: ${response.status}`);
    }
    return response.json();
  },

  updateTest: async (id: number, testData: Partial<Test>): Promise<Test> => {
    const response = await fetch(`${API_URL}/lab/masters/tests/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(testData),
    });
    if (!response.ok) {
      throw new Error(`Failed to update test: ${response.status}`);
    }
    return response.json();
  },

  deleteTest: async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/lab/masters/tests/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Failed to delete test: ${response.status}`);
    }
  },

  // Test Groups
  getTestGroups: async (locationId?: number): Promise<TestGroup[]> => {
    let url = `${API_URL}/lab/masters/test-groups`;
    if (locationId) {
      url += `?locationId=${locationId}`;
    }
    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch test groups: ${response.status}`);
    }
    return response.json();
  },

  createTestGroup: async (groupData: Partial<TestGroup>): Promise<TestGroup> => {
    const response = await fetch(`${API_URL}/lab/masters/test-groups`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(groupData),
    });
    if (!response.ok) {
      throw new Error(`Failed to create test group: ${response.status}`);
    }
    return response.json();
  },

  updateTestGroup: async (id: number, groupData: Partial<TestGroup>): Promise<TestGroup> => {
    const response = await fetch(`${API_URL}/lab/masters/test-groups/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(groupData),
    });
    if (!response.ok) {
      throw new Error(`Failed to update test group: ${response.status}`);
    }
    return response.json();
  },

  deleteTestGroup: async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/lab/masters/test-groups/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Failed to delete test group: ${response.status}`);
    }
  },
};

export default labMastersApi;