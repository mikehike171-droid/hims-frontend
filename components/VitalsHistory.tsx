'use client';

import React, { useState, useEffect } from 'react';
import { frontOfficeApi, PatientVitals } from '../lib/frontOfficeApi';

interface VitalsHistoryProps {
  patientId: number;
}

export default function VitalsHistory({ patientId }: VitalsHistoryProps) {
  const [vitals, setVitals] = useState<PatientVitals[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVitals();
  }, [patientId]);

  const loadVitals = async () => {
    try {
      const data = await frontOfficeApi.getPatientVitals(patientId);
      setVitals(data);
    } catch (error) {
      console.error('Error loading vitals:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading vitals...</div>;
  }

  if (vitals.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No vitals recorded yet
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Vitals History</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Temperature</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Blood Pressure</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Heart Rate</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">O₂ Saturation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {vitals.map((vital) => (
              <tr key={vital.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">
                  {vital.createdAt ? new Date(vital.createdAt).toLocaleDateString() : '-'}
                </td>
                <td className="px-4 py-3 text-sm">
                  {vital.vitalsTemperature ? `${vital.vitalsTemperature}°F` : '-'}
                </td>
                <td className="px-4 py-3 text-sm">
                  {vital.vitalsBloodPressure || '-'}
                </td>
                <td className="px-4 py-3 text-sm">
                  {vital.vitalsHeartRate ? `${vital.vitalsHeartRate} bpm` : '-'}
                </td>
                <td className="px-4 py-3 text-sm">
                  {vital.vitalsO2Saturation ? `${vital.vitalsO2Saturation}%` : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}