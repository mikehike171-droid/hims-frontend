'use client';

import React, { useState } from 'react';
import { frontOfficeApi, PatientVitals } from '../lib/frontOfficeApi';

interface VitalsFormProps {
  patientId: number;
  onSave?: (vitals: PatientVitals) => void;
  onCancel?: () => void;
}

export default function VitalsForm({ patientId, onSave, onCancel }: VitalsFormProps) {
  const [vitals, setVitals] = useState<PatientVitals>({
    patientId,
    vitalsTemperature: undefined,
    vitalsBloodPressure: '',
    vitalsHeartRate: undefined,
    vitalsO2Saturation: undefined,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const savedVitals = await frontOfficeApi.savePatientVitals(vitals);
      onSave?.(savedVitals);
    } catch (error) {
      console.error('Error saving vitals:', error);
      alert('Failed to save vitals data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Patient Vitals</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Temperature (°F)
            </label>
            <input
              type="number"
              step="0.1"
              value={vitals.vitalsTemperature || ''}
              onChange={(e) => setVitals({
                ...vitals,
                vitalsTemperature: e.target.value ? parseFloat(e.target.value) : undefined
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="98.6"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Blood Pressure
            </label>
            <input
              type="text"
              value={vitals.vitalsBloodPressure || ''}
              onChange={(e) => setVitals({
                ...vitals,
                vitalsBloodPressure: e.target.value
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="120/80"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Heart Rate (bpm)
            </label>
            <input
              type="number"
              value={vitals.vitalsHeartRate || ''}
              onChange={(e) => setVitals({
                ...vitals,
                vitalsHeartRate: e.target.value ? parseInt(e.target.value) : undefined
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="72"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              O₂ Saturation (%)
            </label>
            <input
              type="number"
              step="0.01"
              value={vitals.vitalsO2Saturation || ''}
              onChange={(e) => setVitals({
                ...vitals,
                vitalsO2Saturation: e.target.value ? parseFloat(e.target.value) : undefined
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="98.5"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Vitals'}
          </button>
        </div>
      </form>
    </div>
  );
}