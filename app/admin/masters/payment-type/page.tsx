'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { settingsApi } from '@/lib/settingsApi';

interface PaymentType {
  id: number;
  name: string;
  code: string;
  isActive: boolean;
  createdAt: string;
}

export default function PaymentTypePage() {
  const [paymentTypes, setPaymentTypes] = useState<PaymentType[]>([]);
  const [formData, setFormData] = useState({ name: '', code: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchPaymentTypes();
    }
  }, []);

  const fetchPaymentTypes = async () => {
    try {
      const data = await settingsApi.getPaymentTypes();
      setPaymentTypes(data);
    } catch (error) {
      toast.error('Failed to fetch payment types');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Payment type name is required');
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        await settingsApi.updatePaymentType(editingId, formData);
        toast.success('Payment type updated successfully');
      } else {
        await settingsApi.createPaymentType(formData);
        toast.success('Payment type created successfully');
      }
      setFormData({ name: '', code: '' });
      setEditingId(null);
      fetchPaymentTypes();
    } catch (error) {
      toast.error('Failed to save payment type');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (paymentType: PaymentType) => {
    setFormData({ name: paymentType.name, code: paymentType.code || '' });
    setEditingId(paymentType.id);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this payment type?')) return;

    try {
      await settingsApi.deletePaymentType(id);
      toast.success('Payment type deleted successfully');
      fetchPaymentTypes();
    } catch (error) {
      toast.error('Failed to delete payment type');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', code: '' });
    setEditingId(null);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Payment Type Master</h1>
        <p className="text-gray-600 mt-2">Manage payment types for the system</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              {editingId ? 'Edit Payment Type' : 'Add New Payment Type'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter payment type name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Code</label>
                <Input
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="Enter payment type code"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : editingId ? 'Update' : 'Create'}
                </Button>
                {editingId && (
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* List */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Types</CardTitle>
          </CardHeader>
          <CardContent>
            {paymentTypes.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No payment types found</p>
            ) : (
              <div className="space-y-3">
                {paymentTypes.map((paymentType) => (
                  <div
                    key={paymentType.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{paymentType.name}</span>
                        {paymentType.code && (
                          <Badge variant="secondary">{paymentType.code}</Badge>
                        )}
                        <Badge variant={paymentType.isActive ? 'default' : 'destructive'}>
                          {paymentType.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500">
                        Created: {new Date(paymentType.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(paymentType)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(paymentType.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}