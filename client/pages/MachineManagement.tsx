import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Coffee,
  Droplets,
  Milk,
  Candy,
  Settings,
  Calendar,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  Save,
  Eye,
  Edit3
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface MachineData {
  id: string;
  name: string;
  location: string;
  status: 'operational' | 'maintenance' | 'offline';
  lastMaintenance: string;
  nextMaintenance: string;
  supplies: {
    water: number;
    milk: number;
    coffeeBeans: number;
    sugar: number;
  };
  maintenance: {
    filterStatus: 'good' | 'needs_replacement' | 'critical';
    cleaningStatus: 'clean' | 'needs_cleaning' | 'overdue';
    temperature: number;
    pressure: number;
  };
  usage: {
    dailyCups: number;
    weeklyCups: number;
    monthlyRevenue: number;
  };
  notes: string;
}

export default function MachineManagement() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  const [machineData, setMachineData] = useState<MachineData>({
    id: 'A-001',
    name: 'Machine A-001',
    location: 'New York - Main Office - 2nd Floor',
    status: 'operational',
    lastMaintenance: '2024-01-10',
    nextMaintenance: '2024-02-10',
    supplies: {
      water: 85,
      milk: 60,
      coffeeBeans: 75,
      sugar: 90
    },
    maintenance: {
      filterStatus: 'good',
      cleaningStatus: 'clean',
      temperature: 92,
      pressure: 15
    },
    usage: {
      dailyCups: 127,
      weeklyCups: 890,
      monthlyRevenue: 2340
    },
    notes: 'Machine running smoothly. Recent cleaning completed on schedule.'
  });

  const canEdit = user?.role === 'technician';

  const handleSave = () => {
    // In a real app, this would save to backend
    setIsEditing(false);
    console.log('Saving machine data:', machineData);
  };

  const updateSupply = (supply: keyof MachineData['supplies'], value: number) => {
    setMachineData(prev => ({
      ...prev,
      supplies: {
        ...prev.supplies,
        [supply]: value
      }
    }));
  };

  const updateMaintenance = (field: keyof MachineData['maintenance'], value: any) => {
    setMachineData(prev => ({
      ...prev,
      maintenance: {
        ...prev.maintenance,
        [field]: value
      }
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'bg-success-green';
      case 'maintenance': return 'bg-warning-orange';
      case 'offline': return 'bg-destructive';
      default: return 'bg-muted';
    }
  };

  const getSupplyColor = (percentage: number) => {
    if (percentage > 60) return 'bg-success-green';
    if (percentage > 30) return 'bg-warning-orange';
    return 'bg-destructive';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-coffee-light/30 to-background">
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Coffee className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-coffee-brown">Machine Management</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant={user?.role === 'technician' ? 'default' : 'secondary'} className="gap-1">
              {user?.role === 'technician' ? <Edit3 className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              {user?.role === 'technician' ? 'Edit Mode' : 'View Only'}
            </Badge>
            {canEdit && (
              <Button 
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                variant={isEditing ? 'default' : 'outline'}
              >
                {isEditing ? <Save className="w-4 h-4 mr-2" /> : <Edit3 className="w-4 h-4 mr-2" />}
                {isEditing ? 'Save Changes' : 'Edit'}
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Machine Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Coffee className="w-5 h-5" />
                    {machineData.name}
                  </CardTitle>
                  <CardDescription>{machineData.location}</CardDescription>
                </div>
                <Badge className={`${getStatusColor(machineData.status)} text-white`}>
                  {machineData.status.charAt(0).toUpperCase() + machineData.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Supply Levels */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplets className="w-5 h-5" />
                  Supply Levels
                </CardTitle>
                <CardDescription>Current ingredient and supply status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(machineData.supplies).map(([supply, percentage]) => (
                  <div key={supply} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2 capitalize">
                        {supply === 'water' && <Droplets className="w-4 h-4" />}
                        {supply === 'milk' && <Milk className="w-4 h-4" />}
                        {supply === 'coffeeBeans' && <Coffee className="w-4 h-4" />}
                        {supply === 'sugar' && <Sugar className="w-4 h-4" />}
                        {supply === 'coffeeBeans' ? 'Coffee Beans' : supply}
                      </Label>
                      <span className="text-sm font-medium">{percentage}%</span>
                    </div>
                    {isEditing && canEdit ? (
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={percentage}
                        onChange={(e) => updateSupply(supply as keyof MachineData['supplies'], parseInt(e.target.value) || 0)}
                        className="h-8"
                      />
                    ) : (
                      <Progress value={percentage} className={`h-2 ${getSupplyColor(percentage)}`} />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Maintenance Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Maintenance Status
                </CardTitle>
                <CardDescription>Equipment health and maintenance info</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Filter Status</Label>
                    <div className="flex items-center gap-2">
                      {machineData.maintenance.filterStatus === 'good' ? (
                        <CheckCircle className="w-4 h-4 text-success-green" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-warning-orange" />
                      )}
                      <span className="capitalize text-sm">{machineData.maintenance.filterStatus.replace('_', ' ')}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Cleaning Status</Label>
                    <div className="flex items-center gap-2">
                      {machineData.maintenance.cleaningStatus === 'clean' ? (
                        <CheckCircle className="w-4 h-4 text-success-green" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-warning-orange" />
                      )}
                      <span className="capitalize text-sm">{machineData.maintenance.cleaningStatus.replace('_', ' ')}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Temperature</Label>
                    {isEditing && canEdit ? (
                      <Input
                        type="number"
                        value={machineData.maintenance.temperature}
                        onChange={(e) => updateMaintenance('temperature', parseInt(e.target.value) || 0)}
                        className="h-8"
                      />
                    ) : (
                      <p className="text-sm">{machineData.maintenance.temperature}°C</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Pressure</Label>
                    {isEditing && canEdit ? (
                      <Input
                        type="number"
                        value={machineData.maintenance.pressure}
                        onChange={(e) => updateMaintenance('pressure', parseInt(e.target.value) || 0)}
                        className="h-8"
                      />
                    ) : (
                      <p className="text-sm">{machineData.maintenance.pressure} bar</p>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <Label>Last Maintenance:</Label>
                    <span className="text-sm">{machineData.lastMaintenance}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <Label>Next Maintenance:</Label>
                    <span className="text-sm">{machineData.nextMaintenance}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Usage Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Usage Statistics</CardTitle>
                <CardDescription>Performance and usage metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-primary">{machineData.usage.dailyCups}</p>
                    <p className="text-sm text-muted-foreground">Cups Today</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-primary">{machineData.usage.weeklyCups}</p>
                    <p className="text-sm text-muted-foreground">This Week</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-primary">${machineData.usage.monthlyRevenue}</p>
                    <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Technician Notes</CardTitle>
                <CardDescription>Maintenance notes and observations</CardDescription>
              </CardHeader>
              <CardContent>
                {isEditing && canEdit ? (
                  <Textarea
                    value={machineData.notes}
                    onChange={(e) => setMachineData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Add maintenance notes..."
                    className="min-h-[100px]"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {machineData.notes || 'No notes available.'}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
