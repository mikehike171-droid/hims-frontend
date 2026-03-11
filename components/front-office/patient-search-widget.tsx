'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, User, Phone, Calendar } from 'lucide-react';
import { patientApi } from '@/lib/api/frontOfficeApi';

interface PatientSearchWidgetProps {
  locationId: number;
  token: string;
  onPatientSelect?: (patient: any) => void;
}

export function PatientSearchWidget({ locationId, token, onPatientSelect }: PatientSearchWidgetProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const results = await patientApi.search(searchQuery, locationId, token);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching patients:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handlePatientSelect = (patient: any) => {
    if (onPatientSelect) {
      onPatientSelect(patient);
    }
    setSearchResults([]);
    setSearchQuery('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Patient Search
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input
            placeholder="Search by name, phone, or patient ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch} disabled={isSearching}>
            {isSearching ? 'Searching...' : 'Search'}
          </Button>
        </div>
        
        {searchResults.length > 0 && (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {searchResults.map((patient: any) => (
              <div 
                key={patient.id} 
                className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => handlePatientSelect(patient)}
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{patient.firstName} {patient.lastName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-3 w-3" />
                      <span>{patient.phone}</span>
                    </div>
                    {patient.dateOfBirth && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(patient.dateOfBirth).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">{patient.patientId}</Badge>
                    {patient.bloodGroup && (
                      <p className="text-xs text-gray-500 mt-1">{patient.bloodGroup}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {searchQuery && searchResults.length === 0 && !isSearching && (
          <p className="text-sm text-gray-500 text-center py-4">
            No patients found matching "{searchQuery}"
          </p>
        )}
      </CardContent>
    </Card>
  );
}