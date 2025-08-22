import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  getMachines,
  getMachine,
  getMachineByMachineId,
  updateMachine,
  updateSupplies,
  getLocations,
  getOffices,
  getFloors,
  getMachinesByLocationOfficeFloor,
  getLowSupplyMachines,
  getMaintenanceNeededMachines,
} from "./routes/machines";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Note: Machine API routes moved to Java backend on port 8081
  // The frontend should use Java backend for authentication and machine management
  // These routes are kept for fallback/demo purposes only
  app.get("/api/fallback/machines/locations", getLocations);
  app.get("/api/fallback/machines/offices", getOffices);
  app.get("/api/fallback/machines/floors", getFloors);
  app.get(
    "/api/fallback/machines/by-location",
    getMachinesByLocationOfficeFloor,
  );
  app.get("/api/fallback/machines/low-supply", getLowSupplyMachines);
  app.get(
    "/api/fallback/machines/maintenance-needed",
    getMaintenanceNeededMachines,
  );
  app.get("/api/fallback/machines/machine/:machineId", getMachineByMachineId);
  app.get("/api/fallback/machines", getMachines);
  app.get("/api/fallback/machines/:id", getMachine);
  app.put("/api/fallback/machines/:id", updateMachine);
  app.put("/api/fallback/machines/:id/supplies", updateSupplies);

  return app;
}
