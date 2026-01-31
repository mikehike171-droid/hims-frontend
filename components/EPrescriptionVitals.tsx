'use client';

import React, { useState } from 'react';
import VitalsModal from './VitalsModal';
import VitalsHistory from './VitalsHistory';
import { PatientVitals } from '../lib/frontOfficeApi';

interface EPrescriptionVitalsProps {
  patientId: number;
  patientName: string;
}

export default function EPrescriptionVitals({ patientId, patientName }: EPrescriptionVitalsProps) {
  const [showVitalsModal, setShowVitalsModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleVitalsSaved = (vitals: PatientVitals) => {
    console.log('Vitals saved:', vitals);
    setRefreshKey(prev => prev + 1); // Refresh the history
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Vitals Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Patient Vitals - {patientName}</h2>
        <button
          onClick={() => setShowVitalsModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Vitals
        </button>
      </div>

      {/* Vitals History */}
      <VitalsHistory key={refreshKey} patientId={patientId} />

      {/* Vitals Modal */}
      <VitalsModal
        isOpen={showVitalsModal}
        patientId={patientId}
        patientName={patientName}
        onClose={() => setShowVitalsModal(false)}
        onSave={handleVitalsSaved}
      />
    </div>
  );
}