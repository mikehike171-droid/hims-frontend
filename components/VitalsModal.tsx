'use client';

import React from 'react';
import VitalsForm from './VitalsForm';
import { PatientVitals } from '../lib/frontOfficeApi';

interface VitalsModalProps {
  isOpen: boolean;
  patientId: number;
  patientName?: string;
  onClose: () => void;
  onSave?: (vitals: PatientVitals) => void;
}

export default function VitalsModal({ isOpen, patientId, patientName, onClose, onSave }: VitalsModalProps) {
  if (!isOpen) return null;

  const handleSave = (vitals: PatientVitals) => {
    onSave?.(vitals);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">
            Enter Vitals {patientName && `- ${patientName}`}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>
        
        <div className="p-6">
          <VitalsForm
            patientId={patientId}
            onSave={handleSave}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
}