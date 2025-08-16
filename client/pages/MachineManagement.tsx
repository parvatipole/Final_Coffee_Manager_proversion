import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  Edit3,
  Plus,
  RotateCcw,
  Zap,
  Activity,
  TrendingUp,
  Clock,
  RefreshCw,
  MapPin,
  Building,
} from "lucide-react";
import { Link } from "react-router-dom";
import SupplyRefillModal from "@/components/SupplyRefillModal";
import RealTimeMonitor from "@/components/RealTimeMonitor";
import UsageChart from "@/components/UsageChart";
import MachineStatusDashboard from "@/components/MachineStatusDashboard";
import InteractiveBreadcrumb from "@/components/InteractiveBreadcrumb";
import { pathToOfficeName } from "@/lib/officeRouting";

interface MachineData {
  id: string;
  name: string;
  location: string;
  status: "operational" | "maintenance" | "offline";
  lastMaintenance: string;
  nextMaintenance: string;
  supplies: {
    water: number;
    milk: number;
    coffeeBeans: number;
    sugar: number;
  };
  maintenance: {
    filterStatus: "good" | "needs_replacement" | "critical";
    cleaningStatus: "clean" | "needs_cleaning" | "overdue";
    temperature: number;
    pressure: number;
  };
  usage: {
    dailyCups: number;
    weeklyCups: number;
  };
  notes: string;
}

interface MachineManagementProps {
  officePath?: string; // Optional for backward compatibility
}

export default function MachineManagement({ officePath }: MachineManagementProps = {}) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [refillModalOpen, setRefillModalOpen] = useState(false);
  const [selectedSupply, setSelectedSupply] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get office-specific machine data
  const getOfficeMachineData = () => {
    const officeMachines = {
      "Hinjewadi IT Park": {
        id: "HIJ-001",
        name: "Coffee Station Alpha",
        location: "Hinjewadi IT Park - Building A2",
        status: "operational" as const,
        lastMaintenance: "2024-01-10",
        nextMaintenance: "2024-02-10",
        supplies: { water: 85, milk: 60, coffeeBeans: 75, sugar: 90 },
        maintenance: {
          filterStatus: "good",
          cleaningStatus: "clean",
          temperature: 92,
          pressure: 15,
        },
        usage: { dailyCups: 127, weeklyCups: 890 },
        notes:
          "Machine running smoothly. Recent cleaning completed on schedule.",
      },
      "Koregaon Park Office": {
        id: "KOR-001",
        name: "Espresso Pro",
        location: "Koregaon Park Office - Ground Floor",
        status: "maintenance" as const,
        lastMaintenance: "2024-01-05",
        nextMaintenance: "2024-02-05",
        supplies: { water: 45, milk: 80, coffeeBeans: 30, sugar: 95 },
        maintenance: {
          filterStatus: "replace",
          cleaningStatus: "needed",
          temperature: 88,
          pressure: 12,
        },
        usage: { dailyCups: 89, weeklyCups: 650 },
        notes: "Filter replacement scheduled for today.",
      },
      "Baner Tech Hub": {
        id: "BAN-001",
        name: "Latte Master",
        location: "Baner Tech Hub - 3rd Floor",
        status: "operational" as const,
        lastMaintenance: "2024-01-12",
        nextMaintenance: "2024-02-12",
        supplies: { water: 90, milk: 45, coffeeBeans: 85, sugar: 70 },
        maintenance: {
          filterStatus: "good",
          cleaningStatus: "clean",
          temperature: 94,
          pressure: 16,
        },
        usage: { dailyCups: 156, weeklyCups: 1120 },
        notes: "High usage office. Consider additional machine.",
      },
      "Mumbai BKC": {
        id: "BKC-001",
        name: "Cappuccino Deluxe",
        location: "Mumbai BKC - 12th Floor",
        status: "operational" as const,
        lastMaintenance: "2024-01-08",
        nextMaintenance: "2024-02-08",
        supplies: { water: 70, milk: 85, coffeeBeans: 60, sugar: 80 },
        maintenance: {
          filterStatus: "good",
          cleaningStatus: "recent",
          temperature: 91,
          pressure: 14,
        },
        usage: { dailyCups: 98, weeklyCups: 720 },
        notes: "New installation. Performing well.",
      },
      "Andheri East": {
        id: "AND-001",
        name: "Premium Coffee Station",
        location: "Andheri East - 8th Floor",
        status: "operational" as const,
        lastMaintenance: "2024-01-15",
        nextMaintenance: "2024-02-15",
        supplies: { water: 95, milk: 70, coffeeBeans: 80, sugar: 85 },
        maintenance: {
          filterStatus: "good",
          cleaningStatus: "clean",
          temperature: 90,
          pressure: 13,
        },
        usage: { dailyCups: 110, weeklyCups: 770 },
        notes: "Excellent performance. Regular maintenance on track.",
      },
      "Magarpatta City": {
        id: "MAG-001",
        name: "Business Brew",
        location: "Magarpatta City - Tower B",
        status: "operational" as const,
        lastMaintenance: "2024-01-14",
        nextMaintenance: "2024-02-14",
        supplies: { water: 88, milk: 65, coffeeBeans: 72, sugar: 92 },
        maintenance: {
          filterStatus: "good",
          cleaningStatus: "clean",
          temperature: 93,
          pressure: 15,
        },
        usage: { dailyCups: 134, weeklyCups: 945 },
        notes: "Busy corporate environment. Machine handling well.",
      },
      "Wakad Business Center": {
        id: "WAK-001",
        name: "Executive Espresso",
        location: "Wakad Business Center - 5th Floor",
        status: "operational" as const,
        lastMaintenance: "2024-01-11",
        nextMaintenance: "2024-02-11",
        supplies: { water: 75, milk: 88, coffeeBeans: 65, sugar: 78 },
        maintenance: {
          filterStatus: "good",
          cleaningStatus: "recent",
          temperature: 89,
          pressure: 14,
        },
        usage: { dailyCups: 102, weeklyCups: 714 },
        notes: "Consistent performance. Minor adjustment needed on pressure.",
      },
      "Viman Nagar Branch": {
        id: "VIM-001",
        name: "Tech Hub Coffee",
        location: "Viman Nagar Branch - Ground Floor",
        status: "maintenance" as const,
        lastMaintenance: "2024-01-06",
        nextMaintenance: "2024-02-06",
        supplies: { water: 35, milk: 55, coffeeBeans: 40, sugar: 65 },
        maintenance: {
          filterStatus: "needs_replacement",
          cleaningStatus: "needs_cleaning",
          temperature: 85,
          pressure: 11,
        },
        usage: { dailyCups: 78, weeklyCups: 546 },
        notes: "Scheduled maintenance in progress. Filter and cleaning required.",
      },
      "Powai Tech Park": {
        id: "POW-001",
        name: "Innovation Brew",
        location: "Powai Tech Park - 15th Floor",
        status: "operational" as const,
        lastMaintenance: "2024-01-13",
        nextMaintenance: "2024-02-13",
        supplies: { water: 82, milk: 90, coffeeBeans: 78, sugar: 85 },
        maintenance: {
          filterStatus: "good",
          cleaningStatus: "clean",
          temperature: 92,
          pressure: 16,
        },
        usage: { dailyCups: 145, weeklyCups: 1015 },
        notes: "High-tech environment. Machine performing excellently.",
      },
      "Lower Parel": {
        id: "LOW-001",
        name: "Central Coffee Hub",
        location: "Lower Parel - 10th Floor",
        status: "operational" as const,
        lastMaintenance: "2024-01-09",
        nextMaintenance: "2024-02-09",
        supplies: { water: 78, milk: 72, coffeeBeans: 88, sugar: 90 },
        maintenance: {
          filterStatus: "good",
          cleaningStatus: "clean",
          temperature: 91,
          pressure: 15,
        },
        usage: { dailyCups: 118, weeklyCups: 826 },
        notes: "Central location. High foot traffic. Performance stable.",
      },
      "Worli Business District": {
        id: "WOR-001",
        name: "District Deluxe",
        location: "Worli Business District - 20th Floor",
        status: "operational" as const,
        lastMaintenance: "2024-01-12",
        nextMaintenance: "2024-02-12",
        supplies: { water: 92, milk: 68, coffeeBeans: 84, sugar: 76 },
        maintenance: {
          filterStatus: "good",
          cleaningStatus: "recent",
          temperature: 94,
          pressure: 17,
        },
        usage: { dailyCups: 167, weeklyCups: 1169 },
        notes: "Premium location. Excellent usage patterns.",
      },
      "Goregaon East": {
        id: "GOR-001",
        name: "Suburban Station",
        location: "Goregaon East - 6th Floor",
        status: "operational" as const,
        lastMaintenance: "2024-01-07",
        nextMaintenance: "2024-02-07",
        supplies: { water: 80, milk: 85, coffeeBeans: 70, sugar: 88 },
        maintenance: {
          filterStatus: "good",
          cleaningStatus: "clean",
          temperature: 90,
          pressure: 13,
        },
        usage: { dailyCups: 95, weeklyCups: 665 },
        notes: "Suburban office. Steady usage. All systems normal.",
      },
    };

    // Determine which office to show
    let targetOffice: string;

    if (officePath) {
      // Convert path back to office name using proper mapping
      targetOffice = pathToOfficeName(officePath);
    } else if (user?.officeName) {
      targetOffice = user.officeName;
    } else {
      // Default fallback
      targetOffice = "Hinjewadi IT Park";
    }

    return (
      officeMachines[targetOffice as keyof typeof officeMachines] ||
      officeMachines["Hinjewadi IT Park"]
    );
  };

  const [machineData, setMachineData] = useState<MachineData>(
    getOfficeMachineData(),
  );

  const canEdit = user?.role === "technician";

  // Alert management state
  const [alerts, setAlerts] = useState([
    {
      id: "1",
      type: "critical",
      title: "Water filter needs immediate replacement",
      description: "Filter life: 5%",
      category: "maintenance",
      resolved: false,
      resolvedBy: null,
      resolvedAt: null,
    },
    {
      id: "2",
      type: "warning",
      title: "Coffee beans running low",
      description: "15% remaining - refill recommended",
      category: "supply",
      resolved: false,
      resolvedBy: null,
      resolvedAt: null,
    },
    {
      id: "3",
      type: "info",
      title: "Deep cleaning scheduled",
      description: "Last cleaned 48 hours ago",
      category: "cleaning",
      resolved: false,
      resolvedBy: null,
      resolvedAt: null,
    },
    {
      id: "4",
      type: "resolved",
      title: "Water tank refilled",
      description: "Refilled to 100%",
      category: "supply",
      resolved: true,
      resolvedBy: user?.name,
      resolvedAt: "2 hours ago",
    },
  ]);

  // Handle alert resolution
  const handleAlertResolution = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId
          ? {
              ...alert,
              resolved: true,
              resolvedBy: user?.name || "Technician",
              resolvedAt: "Just now",
            }
          : alert,
      ),
    );
  };

  const supplies = [
    {
      name: "Water",
      key: "water",
      current: machineData.supplies.water,
      icon: <Droplets className="w-4 h-4" />,
      unit: "L",
      cost: 25,
    },
    {
      name: "Milk",
      key: "milk",
      current: machineData.supplies.milk,
      icon: <Milk className="w-4 h-4" />,
      unit: "L",
      cost: 45,
    },
    {
      name: "Coffee Beans",
      key: "coffeeBeans",
      current: machineData.supplies.coffeeBeans,
      icon: <Coffee className="w-4 h-4" />,
      unit: "kg",
      cost: 120,
    },
    {
      name: "Sugar",
      key: "sugar",
      current: machineData.supplies.sugar,
      icon: <Candy className="w-4 h-4" />,
      unit: "kg",
      cost: 30,
    },
  ];

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate save operation
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsEditing(false);
    setIsLoading(false);
  };

  const handleSupplyRefill = (supplyKey: string, amount: number) => {
    setMachineData((prev) => ({
      ...prev,
      supplies: {
        ...prev.supplies,
        [supplyKey]: Math.min(
          100,
          prev.supplies[supplyKey as keyof typeof prev.supplies] + amount,
        ),
      },
    }));
  };

  const openRefillModal = (supply: any) => {
    if (!canEdit) return;
    setSelectedSupply(supply);
    setRefillModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "bg-green-500";
      case "maintenance":
        return "bg-orange-500";
      case "offline":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getSupplyColor = (percentage: number) => {
    if (percentage > 60) return "text-green-600";
    if (percentage > 30) return "text-orange-500";
    return "text-red-500";
  };

  const getSupplyIcon = (percentage: number) => {
    if (percentage > 60)
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (percentage > 30)
      return <AlertTriangle className="w-4 h-4 text-orange-500" />;
    return <AlertTriangle className="w-4 h-4 text-red-500" />;
  };

  // Animate progress bars on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      // Trigger rerender to animate progress bars
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-coffee-light/30 to-background">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <InteractiveBreadcrumb backUrl="/dashboard" className="flex-1" />
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center animate-pulse">
              <Coffee className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-coffee-brown">
              {officePath ? `${pathToOfficeName(officePath)} - Coffee Machines` : "Machine Management"}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {(user?.officeName || officePath) && (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="gap-1 animate-fadeIn">
                  <Building className="w-3 h-3" />
                  {officePath ? pathToOfficeName(officePath) : user?.officeName}
                </Badge>
                {user?.city && (
                  <Badge variant="secondary" className="gap-1 animate-fadeIn">
                    <MapPin className="w-3 h-3" />
                    {user.city.charAt(0).toUpperCase() + user.city.slice(1)}
                  </Badge>
                )}
              </div>
            )}
            <Badge
              variant={user?.role === "technician" ? "default" : "secondary"}
              className="gap-1 animate-fadeIn"
            >
              {user?.role === "technician" ? (
                <Edit3 className="w-3 h-3" />
              ) : (
                <Eye className="w-3 h-3" />
              )}
              {user?.role === "technician" ? "Edit Mode" : "View Only"}
            </Badge>
            {canEdit && (
              <Button
                onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                variant={isEditing ? "default" : "outline"}
                disabled={isLoading}
                className="hover:scale-105 transition-transform"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : isEditing ? (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                ) : (
                  <>
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Machine Overview */}
          <Card className="animate-fadeIn">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Coffee className="w-5 h-5" />
                    {machineData.name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <MapPin className="w-3 h-3" />
                    {machineData.location}
                  </CardDescription>
                  {user?.role === "technician" && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Assigned to: {user.name}
                    </div>
                  )}
                </div>
                <Badge
                  className={`${getStatusColor(machineData.status)} text-white animate-pulse`}
                >
                  {machineData.status.charAt(0).toUpperCase() +
                    machineData.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
          </Card>

          {/* Main Dashboard Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="supplies" className="flex items-center gap-2">
                <Droplets className="w-4 h-4" />
                Supplies
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                Analytics
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RealTimeMonitor />
                <MachineStatusDashboard
                  canControl={canEdit}
                  onStatusChange={(status) => {
                    // Real-time status updated
                  }}
                />
              </div>

              {/* Enhanced Machine Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="animate-fadeIn">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Operating Hours
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Today</span>
                        <Badge variant="outline">8.5 hrs</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">This Week</span>
                        <Badge variant="outline">52 hrs</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Monthly Avg</span>
                        <Badge variant="default">45 hrs</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className="animate-fadeIn"
                  style={{ animationDelay: "100ms" }}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Maintenance Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Filter</span>
                        <Badge variant="secondary">Good</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Last Service</span>
                        <span className="text-xs text-muted-foreground">
                          5 days ago
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Next Service</span>
                        <span className="text-xs text-muted-foreground">
                          25 days
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className="animate-fadeIn"
                  style={{ animationDelay: "200ms" }}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Efficiency</span>
                        <Badge variant="default">94%</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Uptime</span>
                        <Badge variant="default">99.2%</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Error Rate</span>
                        <Badge variant="outline">0.8%</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Alerts & Issues Section */}
              <Card
                className="animate-fadeIn"
                style={{ animationDelay: "300ms" }}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Machine Alerts & Issues
                  </CardTitle>
                  <CardDescription>
                    Monitor and resolve machine issues (
                    {alerts.filter((a) => !a.resolved).length} active)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {alerts.map((alert) => {
                      const getAlertColor = (
                        type: string,
                        resolved: boolean,
                      ) => {
                        if (resolved) return "border-green-200 bg-green-50";
                        switch (type) {
                          case "critical":
                            return "border-red-200 bg-red-50";
                          case "warning":
                            return "border-orange-200 bg-orange-50";
                          case "info":
                            return "border-blue-200 bg-blue-50";
                          default:
                            return "border-gray-200 bg-gray-50";
                        }
                      };

                      const getAlertIcon = (
                        type: string,
                        resolved: boolean,
                      ) => {
                        if (resolved)
                          return (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          );
                        switch (type) {
                          case "critical":
                            return (
                              <AlertTriangle className="h-4 w-4 text-red-600" />
                            );
                          case "warning":
                            return (
                              <AlertTriangle className="h-4 w-4 text-orange-600" />
                            );
                          case "info":
                            return <Clock className="h-4 w-4 text-blue-600" />;
                          default:
                            return (
                              <AlertTriangle className="h-4 w-4 text-gray-600" />
                            );
                        }
                      };

                      const getAlertPrefix = (
                        type: string,
                        resolved: boolean,
                      ) => {
                        if (resolved) return "Resolved:";
                        switch (type) {
                          case "critical":
                            return "Critical:";
                          case "warning":
                            return "Warning:";
                          case "info":
                            return "Info:";
                          default:
                            return "Alert:";
                        }
                      };

                      return (
                        <Alert
                          key={alert.id}
                          className={getAlertColor(alert.type, alert.resolved)}
                        >
                          {getAlertIcon(alert.type, alert.resolved)}
                          <AlertDescription>
                            <div className="flex items-center justify-between">
                              <div>
                                <strong>
                                  {getAlertPrefix(alert.type, alert.resolved)}
                                </strong>{" "}
                                {alert.title} - {alert.description}
                                {alert.resolved && alert.resolvedBy && (
                                  <div className="text-xs text-muted-foreground mt-1">
                                    Resolved by {alert.resolvedBy} (
                                    {alert.resolvedAt})
                                  </div>
                                )}
                              </div>
                              {canEdit && !alert.resolved && (
                                <div className="flex items-center gap-2 ml-4">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      handleAlertResolution(alert.id)
                                    }
                                  >
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Mark Resolved
                                  </Button>
                                </div>
                              )}
                              {alert.resolved && (
                                <Badge
                                  variant="default"
                                  className="bg-green-100 text-green-800"
                                >
                                  ✓ Resolved
                                </Badge>
                              )}
                            </div>
                          </AlertDescription>
                        </Alert>
                      );
                    })}

                    {alerts.filter((a) => !a.resolved).length === 0 && (
                      <div className="text-center py-8">
                        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                        <h3 className="text-lg font-medium">All Clear!</h3>
                        <p className="text-muted-foreground">
                          No active alerts for this machine.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Machine Notes Section for Technicians */}
              {canEdit && (
                <Card
                  className="animate-fadeIn"
                  style={{ animationDelay: "400ms" }}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Edit3 className="w-4 h-4" />
                      Technician Notes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Textarea
                        value={machineData.notes}
                        onChange={(e) =>
                          setMachineData((prev) => ({
                            ...prev,
                            notes: e.target.value,
                          }))
                        }
                        placeholder="Add maintenance notes, observations, or reminders..."
                        className="min-h-[100px]"
                      />
                      <div className="flex justify-end">
                        <Button
                          size="sm"
                          onClick={() => console.log("Notes saved")}
                        >
                          <Save className="w-3 h-3 mr-2" />
                          Save Notes
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Supplies Tab */}
            <TabsContent value="supplies" className="space-y-6">
              {/* Supply Level Overview */}
              <Card className="animate-fadeIn">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Droplets className="w-5 h-5" />
                    Supply Status Overview
                  </CardTitle>
                  <CardDescription>
                    Current supply levels and consumption trends
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {supplies.map((supply, index) => (
                      <div key={supply.key} className="text-center">
                        <div className="flex items-center justify-center mb-2">
                          {supply.icon}
                        </div>
                        <Progress value={supply.current} className="mb-2" />
                        <div className="text-sm font-medium">
                          {supply.current}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {supply.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Supply Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {supplies.map((supply, index) => (
                  <Card
                    key={supply.key}
                    className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                      canEdit ? "hover:border-primary" : ""
                    } animate-fadeIn`}
                    style={{ animationDelay: `${index * 150}ms` }}
                    onClick={() => openRefillModal(supply)}
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center justify-between text-base">
                        <div className="flex items-center gap-2">
                          {supply.icon}
                          {supply.name}
                        </div>
                        {getSupplyIcon(supply.current)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <div
                          className={`text-3xl font-bold ${getSupplyColor(supply.current)}`}
                        >
                          {supply.current}%
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Current Level
                        </p>
                      </div>

                      <Progress
                        value={supply.current}
                        className="h-3 transition-all duration-1000 ease-out"
                      />

                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Empty</span>
                        <span>Full</span>
                      </div>

                      {canEdit && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full group hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          <Plus className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                          Refill
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Supply Consumption Trends */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card
                  className="animate-fadeIn"
                  style={{ animationDelay: "400ms" }}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Consumption Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Droplets className="w-4 h-4 text-blue-500" />
                          <span className="font-medium">Water</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">15% daily</div>
                          <div className="text-xs text-muted-foreground">
                            Normal usage
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Coffee className="w-4 h-4 text-amber-600" />
                          <span className="font-medium">Coffee Beans</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">12% daily</div>
                          <div className="text-xs text-muted-foreground">
                            High usage
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Milk className="w-4 h-4 text-purple-500" />
                          <span className="font-medium">Milk</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">8% daily</div>
                          <div className="text-xs text-muted-foreground">
                            Low usage
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className="animate-fadeIn"
                  style={{ animationDelay: "500ms" }}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Recent Refills
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                        <div>
                          <div className="font-medium text-sm">Water Tank</div>
                          <div className="text-xs text-muted-foreground">
                            Refilled to 100%
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-medium">2 hours ago</div>
                          <div className="text-xs text-muted-foreground">
                            by {user?.name}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div>
                          <div className="font-medium text-sm">
                            Coffee Beans
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Refilled to 90%
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-medium">Yesterday</div>
                          <div className="text-xs text-muted-foreground">
                            by Tech Support
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <div>
                          <div className="font-medium text-sm">Sugar</div>
                          <div className="text-xs text-muted-foreground">
                            Refilled to 95%
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-medium">3 days ago</div>
                          <div className="text-xs text-muted-foreground">
                            by John Tech
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <UsageChart />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="animate-fadeIn">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <Coffee className="w-4 h-4" />
                      Today's Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-2">
                      <div className="text-3xl font-bold text-primary animate-counter">
                        {machineData.usage.dailyCups}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Cups Served
                      </p>
                      <div className="flex items-center justify-center gap-1 text-green-600">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-sm">+12% vs yesterday</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className="animate-fadeIn"
                  style={{ animationDelay: "200ms" }}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Peak Hours
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">8-9 AM</span>
                        <Badge variant="outline">52 cups</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">1-2 PM</span>
                        <Badge variant="outline">48 cups</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">3-4 PM</span>
                        <Badge variant="outline">35 cups</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className="animate-fadeIn"
                  style={{ animationDelay: "400ms" }}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Efficiency
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Uptime</span>
                        <span className="font-bold text-green-600">99.2%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Avg Brew Time</span>
                        <span className="font-bold">45s</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Energy Usage</span>
                        <span className="font-bold text-primary">85kWh</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Supply Refill Modal */}
      {selectedSupply && (
        <SupplyRefillModal
          isOpen={refillModalOpen}
          onClose={() => {
            setRefillModalOpen(false);
            setSelectedSupply(null);
          }}
          supply={selectedSupply}
          onRefill={(amount) => handleSupplyRefill(selectedSupply.key, amount)}
          canEdit={canEdit}
        />
      )}
    </div>
  );
}
