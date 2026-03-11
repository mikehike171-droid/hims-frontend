'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, Users, Play, CheckCircle } from 'lucide-react';
import { queueApi } from '@/lib/api/frontOfficeApi';

interface QueueManagementWidgetProps {
  locationId: number;
  token: string;
}

export function QueueManagementWidget({ locationId, token }: QueueManagementWidgetProps) {
  const [queueTokens, setQueueTokens] = useState<any[]>([]);
  const [queueStats, setQueueStats] = useState<any>({});
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadQueueData();
    // Refresh every 30 seconds
    const interval = setInterval(loadQueueData, 30000);
    return () => clearInterval(interval);
  }, [locationId, token]);

  const loadQueueData = async () => {
    try {
      const [tokens, stats] = await Promise.all([
        queueApi.getTokens(locationId, 'waiting', token),
        queueApi.getStats(locationId, token)
      ]);
      setQueueTokens(tokens || []);
      setQueueStats(stats || {});
    } catch (error) {
      console.error('Error loading queue data:', error);
    }
  };

  const handleCallNext = async () => {
    setLoading(true);
    try {
      await queueApi.callNext(locationId, selectedDepartment, token);
      await loadQueueData(); // Refresh data
    } catch (error) {
      console.error('Error calling next patient:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (tokenId: number, status: string) => {
    try {
      await queueApi.updateStatus(tokenId, status, token);
      await loadQueueData(); // Refresh data
    } catch (error) {
      console.error('Error updating token status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'secondary';
      case 'in_progress': return 'default';
      case 'completed': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-4">
      {/* Queue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Waiting</p>
                <p className="text-2xl font-bold">{queueStats.waiting || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Play className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold">{queueStats.inProgress || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold">{queueStats.completed || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Avg Wait</p>
                <p className="text-2xl font-bold">{queueStats.averageWaitTime || 0}m</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Queue Management */}
      <Card>
        <CardHeader>
          <CardTitle>Queue Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Departments</SelectItem>
                <SelectItem value="consultation">Consultation</SelectItem>
                <SelectItem value="lab">Laboratory</SelectItem>
                <SelectItem value="pharmacy">Pharmacy</SelectItem>
                <SelectItem value="billing">Billing</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleCallNext} disabled={loading || queueStats.waiting === 0}>
              {loading ? 'Calling...' : 'Call Next Patient'}
            </Button>
            <Button variant="outline" onClick={loadQueueData}>
              Refresh
            </Button>
          </div>

          {/* Queue List */}
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {queueTokens.length > 0 ? (
              queueTokens.map((token: any) => (
                <div key={token.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-center">
                      <p className="font-bold text-lg">#{token.queueNumber}</p>
                      <p className="text-xs text-gray-500">{token.queueType}</p>
                    </div>
                    <div>
                      <p className="font-medium">
                        {token.patient?.firstName} {token.patient?.lastName}
                      </p>
                      <p className="text-sm text-gray-600">{token.patient?.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getStatusColor(token.status)}>
                      {token.status.replace('_', ' ')}
                    </Badge>
                    {token.status === 'waiting' && (
                      <Button 
                        size="sm" 
                        onClick={() => handleUpdateStatus(token.id, 'in_progress')}
                      >
                        Call
                      </Button>
                    )}
                    {token.status === 'in_progress' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleUpdateStatus(token.id, 'completed')}
                      >
                        Complete
                      </Button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">No patients in queue</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}