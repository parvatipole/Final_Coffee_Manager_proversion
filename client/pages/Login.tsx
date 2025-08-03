import React, { useState } from 'react';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Coffee, Settings, Eye, Edit3, Users, Shield, ChevronRight } from 'lucide-react';

export default function Login() {
  const [step, setStep] = useState<'role' | 'credentials'>('role');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();

  const roles = [
    {
      role: 'technician' as UserRole,
      title: 'Technician Interface',
      description: 'Full access to edit machine settings, refill supplies, and perform maintenance',
      icon: <Edit3 className="w-8 h-8" />,
      color: 'bg-primary',
      features: ['Edit machine settings', 'Refill supplies', 'Maintenance controls', 'Real-time monitoring']
    },
    {
      role: 'admin' as UserRole,
      title: 'Admin Interface',
      description: 'View-only access to monitor machine status and performance analytics',
      icon: <Eye className="w-8 h-8" />,
      color: 'bg-secondary',
      features: ['View machine data', 'Performance analytics', 'Usage reports', 'Status monitoring']
    }
  ];

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setStep('credentials');
    // Pre-fill demo credentials based on role
    if (role === 'technician') {
      setUsername('tech1');
      setPassword('password');
    } else {
      setUsername('admin1');
      setPassword('password');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = await login(username, password);
    if (!success) {
      setError('Invalid credentials. Please check your username and password.');
    }
  };

  const handleBack = () => {
    setStep('role');
    setSelectedRole(null);
    setUsername('');
    setPassword('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-coffee-light to-primary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-20 h-20 bg-primary rounded-full flex items-center justify-center animate-pulse">
            <Coffee className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-coffee-brown">Coffee Manager</h1>
          <p className="text-lg text-muted-foreground">Professional Vending Machine Management System</p>
        </div>

        {step === 'role' ? (
          /* Role Selection */
          <Card className="shadow-2xl border-0 animate-fadeIn">
            <CardHeader className="text-center space-y-1">
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                <Users className="w-6 h-6" />
                Choose Your Interface
              </CardTitle>
              <CardDescription className="text-base">
                Select the interface type based on your role and required access level
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {roles.map((roleOption, index) => (
                  <Card 
                    key={roleOption.role}
                    className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 hover:border-primary group animate-slideIn"
                    style={{ animationDelay: `${index * 200}ms` }}
                    onClick={() => handleRoleSelect(roleOption.role)}
                  >
                    <CardHeader className="text-center pb-4">
                      <div className={`mx-auto w-16 h-16 ${roleOption.color} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform text-white`}>
                        {roleOption.icon}
                      </div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {roleOption.title}
                      </CardTitle>
                      <CardDescription className="text-center">
                        {roleOption.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                          Access Includes:
                        </h4>
                        <ul className="space-y-2">
                          {roleOption.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-center gap-2 text-sm">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        <div className="pt-4">
                          <Button 
                            variant="outline" 
                            className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                          >
                            Select {roleOption.title}
                            <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-8 p-6 bg-muted/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium mb-2">Security Notice</h4>
                    <p className="text-sm text-muted-foreground">
                      Access levels are strictly enforced. Technicians have full control capabilities while 
                      admins have comprehensive monitoring and reporting access without edit permissions.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Credentials Form */
          <Card className="shadow-2xl border-0 max-w-md mx-auto animate-slideIn">
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-2 mb-4">
                <Button variant="ghost" size="sm" onClick={handleBack} className="p-0 h-auto">
                  ← Back to role selection
                </Button>
              </div>
              
              <div className="text-center space-y-3">
                <div className="flex items-center justify-center gap-3">
                  <div className={`w-12 h-12 ${selectedRole === 'technician' ? 'bg-primary' : 'bg-secondary'} rounded-full flex items-center justify-center text-white`}>
                    {selectedRole === 'technician' ? <Edit3 className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                  </div>
                  <div>
                    <CardTitle className="text-xl">
                      {selectedRole === 'technician' ? 'Technician' : 'Admin'} Login
                    </CardTitle>
                    <Badge variant={selectedRole === 'technician' ? 'default' : 'secondary'} className="mt-1">
                      {selectedRole === 'technician' ? 'Full Access' : 'View Only'}
                    </Badge>
                  </div>
                </div>
                <CardDescription className="text-center">
                  Enter your {selectedRole} credentials to access the system
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="h-11 transition-all focus:scale-[1.02]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 transition-all focus:scale-[1.02]"
                  />
                </div>

                {error && (
                  <Alert variant="destructive" className="animate-shake">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full h-11 hover:scale-105 transition-transform" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In as {selectedRole === 'technician' ? 'Technician' : 'Admin'}
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t">
                <div className="text-sm text-muted-foreground space-y-2">
                  <p className="font-medium">Demo Account:</p>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2 p-2 bg-muted/30 rounded">
                      {selectedRole === 'technician' ? <Settings className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>
                        {selectedRole === 'technician' ? 'tech1' : 'admin1'} / password
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
