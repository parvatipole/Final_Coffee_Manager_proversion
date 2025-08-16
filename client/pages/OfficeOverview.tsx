import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Coffee,
  Droplets,
  Milk,
  Candy,
  Settings,
  Eye,
  Edit3,
  Zap,
  ZapOff,
  MapPin,
  Building,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
} from "lucide-react";
import { pathToOfficeName } from "@/lib/officeRouting";
import InteractiveBreadcrumb from "@/components/InteractiveBreadcrumb";

interface MachineData {
  id: string;
  name: string;
  location: string;
  status: "operational" | "maintenance" | "offline";
  powerStatus: "online" | "offline";
  lastPowerUpdate: string;
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

export default function OfficeOverview() {
  const { officePath } = useParams<{ officePath: string }>();
  const { user } = useAuth();

  if (!officePath) {
    return <div>Office not found</div>;
  }

  const officeName = pathToOfficeName(officePath);

  // Sample data - multiple machines per office
  const getOfficeMachines = (): MachineData[] => {
    const allOfficeMachines = {
      "Hinjewadi IT Park": [
        {
          id: "HIJ-001",
          name: "Coffee Station Alpha",
          location: "Building A2, Ground Floor",
          status: "operational" as const,
          powerStatus: "online" as const,
          lastPowerUpdate: "2024-01-16 09:30",
          lastMaintenance: "2024-01-10",
          nextMaintenance: "2024-02-10",
          supplies: { water: 85, milk: 60, coffeeBeans: 75, sugar: 90 },
          maintenance: {
            filterStatus: "good" as const,
            cleaningStatus: "clean" as const,
            temperature: 92,
            pressure: 15,
          },
          usage: { dailyCups: 127, weeklyCups: 890 },
          notes:
            "Machine running smoothly. Recent cleaning completed on schedule.",
        },
        {
          id: "HIJ-002",
          name: "Espresso Hub Beta",
          location: "Building B1, 2nd Floor",
          status: "operational" as const,
          powerStatus: "online" as const,
          lastPowerUpdate: "2024-01-16 08:45",
          lastMaintenance: "2024-01-12",
          nextMaintenance: "2024-02-12",
          supplies: { water: 92, milk: 45, coffeeBeans: 88, sugar: 76 },
          maintenance: {
            filterStatus: "good" as const,
            cleaningStatus: "clean" as const,
            temperature: 89,
            pressure: 14,
          },
          usage: { dailyCups: 98, weeklyCups: 686 },
          notes: "High performance. Minor calibration needed.",
        },
        {
          id: "HIJ-003",
          name: "Cafeteria Express",
          location: "Building C, Cafeteria",
          status: "maintenance" as const,
          powerStatus: "offline" as const,
          lastPowerUpdate: "2024-01-16 07:20",
          lastMaintenance: "2024-01-08",
          nextMaintenance: "2024-02-08",
          supplies: { water: 30, milk: 65, coffeeBeans: 40, sugar: 85 },
          maintenance: {
            filterStatus: "needs_replacement" as const,
            cleaningStatus: "needs_cleaning" as const,
            temperature: 85,
            pressure: 11,
          },
          usage: { dailyCups: 156, weeklyCups: 1092 },
          notes:
            "Scheduled maintenance in progress. Filter replacement required.",
        },
      ],
      "Koregaon Park Office": [
        {
          id: "KOR-001",
          name: "Executive Espresso",
          location: "Ground Floor, Reception",
          status: "operational" as const,
          powerStatus: "online" as const,
          lastPowerUpdate: "2024-01-16 10:15",
          lastMaintenance: "2024-01-05",
          nextMaintenance: "2024-02-05",
          supplies: { water: 78, milk: 80, coffeeBeans: 65, sugar: 95 },
          maintenance: {
            filterStatus: "good" as const,
            cleaningStatus: "clean" as const,
            temperature: 88,
            pressure: 12,
          },
          usage: { dailyCups: 89, weeklyCups: 650 },
          notes: "Popular machine. Consistent performance.",
        },
        {
          id: "KOR-002",
          name: "Meeting Room Brew",
          location: "2nd Floor, Conference Area",
          status: "operational" as const,
          powerStatus: "online" as const,
          lastPowerUpdate: "2024-01-16 09:00",
          lastMaintenance: "2024-01-14",
          nextMaintenance: "2024-02-14",
          supplies: { water: 88, milk: 55, coffeeBeans: 82, sugar: 70 },
          maintenance: {
            filterStatus: "good" as const,
            cleaningStatus: "clean" as const,
            temperature: 91,
            pressure: 15,
          },
          usage: { dailyCups: 67, weeklyCups: 469 },
          notes: "Low usage. Perfect for meetings.",
        },
      ],
      "Mumbai BKC": [
        {
          id: "BKC-001",
          name: "BKC Premium Station",
          location: "12th Floor, Main Lobby",
          status: "operational" as const,
          powerStatus: "online" as const,
          lastPowerUpdate: "2024-01-16 11:20",
          lastMaintenance: "2024-01-08",
          nextMaintenance: "2024-02-08",
          supplies: { water: 70, milk: 85, coffeeBeans: 60, sugar: 80 },
          maintenance: {
            filterStatus: "good" as const,
            cleaningStatus: "clean" as const,
            temperature: 91,
            pressure: 14,
          },
          usage: { dailyCups: 98, weeklyCups: 720 },
          notes: "New installation. Performing well.",
        },
      ],
      "Andheri East": [
        {
          id: "AND-001",
          name: "Premium Coffee Station",
          location: "8th Floor, Break Area",
          status: "operational" as const,
          powerStatus: "online" as const,
          lastPowerUpdate: "2024-01-16 09:00",
          lastMaintenance: "2024-01-15",
          nextMaintenance: "2024-02-15",
          supplies: { water: 95, milk: 70, coffeeBeans: 80, sugar: 85 },
          maintenance: {
            filterStatus: "good" as const,
            cleaningStatus: "clean" as const,
            temperature: 90,
            pressure: 13,
          },
          usage: { dailyCups: 110, weeklyCups: 770 },
          notes: "Excellent performance. Regular maintenance on track.",
        },
      ],
    };

    return (
      allOfficeMachines[officeName as keyof typeof allOfficeMachines] || []
    );
  };

  const machines = getOfficeMachines();
  const canEdit = user?.role === "technician";

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
    return "text-red-600";
  };

  const getOverallOfficeStatus = () => {
    const operational = machines.filter(
      (m) => m.status === "operational",
    ).length;
    const maintenance = machines.filter(
      (m) => m.status === "maintenance",
    ).length;
    const offline = machines.filter(
      (m) => m.status === "offline" || m.powerStatus === "offline",
    ).length;

    return { operational, maintenance, offline, total: machines.length };
  };

  const officeStats = getOverallOfficeStatus();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <InteractiveBreadcrumb backUrl="/dashboard" className="flex-1" />
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center animate-pulse">
              <Coffee className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-coffee-brown">
              {officeName} - Coffee Machines
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {user?.officeName && (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="gap-1 animate-fadeIn">
                  <Building className="w-3 h-3" />
                  {officeName}
                </Badge>
                {user.city && (
                  <Badge variant="secondary" className="gap-1 animate-fadeIn">
                    <MapPin className="w-3 h-3" />
                    {user.city.charAt(0).toUpperCase() + user.city.slice(1)}
                  </Badge>
                )}
              </div>
            )}
            <Badge
              variant={canEdit ? "default" : "secondary"}
              className="gap-1 animate-fadeIn"
            >
              {canEdit ? (
                <Edit3 className="w-3 h-3" />
              ) : (
                <Eye className="w-3 h-3" />
              )}
              {canEdit ? "Technician" : "Admin View"}
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Office Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              Office Overview - {officeName}
            </CardTitle>
            <CardDescription>
              Total {officeStats.total} coffee machines •{" "}
              {officeStats.operational} operational • {officeStats.maintenance}{" "}
              in maintenance • {officeStats.offline} offline
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <div className="text-lg font-semibold text-green-700">
                    {officeStats.operational}
                  </div>
                  <div className="text-sm text-green-600">Operational</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                <Settings className="w-5 h-5 text-orange-600" />
                <div>
                  <div className="text-lg font-semibold text-orange-700">
                    {officeStats.maintenance}
                  </div>
                  <div className="text-sm text-orange-600">Maintenance</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <div>
                  <div className="text-lg font-semibold text-red-700">
                    {officeStats.offline}
                  </div>
                  <div className="text-sm text-red-600">Offline</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Machines Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {machines.map((machine) => (
            <Card
              key={machine.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{machine.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {machine.location}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Badge
                      className={`${getStatusColor(machine.status)} text-white text-xs`}
                    >
                      {machine.status.charAt(0).toUpperCase() +
                        machine.status.slice(1)}
                    </Badge>
                    <Badge
                      variant={
                        machine.powerStatus === "online"
                          ? "default"
                          : "destructive"
                      }
                      className="gap-1 text-xs"
                    >
                      {machine.powerStatus === "online" ? (
                        <Zap className="w-2 h-2" />
                      ) : (
                        <ZapOff className="w-2 h-2" />
                      )}
                      {machine.powerStatus.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Supplies */}
                <div className="space-y-2">
                  <div className="text-sm font-medium">Supply Levels</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="flex items-center gap-1">
                          <Droplets className="w-3 h-3 text-blue-500" />
                          Water
                        </span>
                        <span
                          className={getSupplyColor(machine.supplies.water)}
                        >
                          {machine.supplies.water}%
                        </span>
                      </div>
                      <Progress
                        value={machine.supplies.water}
                        className="h-1"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="flex items-center gap-1">
                          <Milk className="w-3 h-3 text-purple-500" />
                          Milk
                        </span>
                        <span className={getSupplyColor(machine.supplies.milk)}>
                          {machine.supplies.milk}%
                        </span>
                      </div>
                      <Progress value={machine.supplies.milk} className="h-1" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="flex items-center gap-1">
                          <Coffee className="w-3 h-3 text-brown-500" />
                          Beans
                        </span>
                        <span
                          className={getSupplyColor(
                            machine.supplies.coffeeBeans,
                          )}
                        >
                          {machine.supplies.coffeeBeans}%
                        </span>
                      </div>
                      <Progress
                        value={machine.supplies.coffeeBeans}
                        className="h-1"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="flex items-center gap-1">
                          <Candy className="w-3 h-3 text-pink-500" />
                          Sugar
                        </span>
                        <span
                          className={getSupplyColor(machine.supplies.sugar)}
                        >
                          {machine.supplies.sugar}%
                        </span>
                      </div>
                      <Progress
                        value={machine.supplies.sugar}
                        className="h-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Usage Stats */}
                <div className="flex justify-between text-sm">
                  <div className="text-center">
                    <div className="font-semibold text-lg">
                      {machine.usage.dailyCups}
                    </div>
                    <div className="text-muted-foreground text-xs">Today</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-lg">
                      {machine.usage.weeklyCups}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      This Week
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-lg">
                      {machine.maintenance.temperature}°C
                    </div>
                    <div className="text-muted-foreground text-xs">Temp</div>
                  </div>
                </div>

                {/* Action Button */}
                <Link to={`/machine/${machine.id}`}>
                  <Button
                    className="w-full"
                    variant={canEdit ? "default" : "outline"}
                  >
                    <Activity className="w-4 h-4 mr-2" />
                    {canEdit ? "Manage Machine" : "View Details"}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {machines.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <Coffee className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No machines found</h3>
              <p className="text-muted-foreground">
                No coffee machines are currently registered for {officeName}.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
