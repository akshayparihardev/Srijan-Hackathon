import { type MachineData } from "@/types";

// Mock Initial Data
export const MOCK_MACHINES: MachineData[] = [
  {
    machine: "Motor_B",
    risk: 82,
    priority: "CRITICAL",
    action: "Check bearings",
    deadline: "Immediate",
    explanation: "Increasing vibration over time",
  },
  {
    machine: "Pump_Alpha",
    risk: 25,
    priority: "LOW",
    action: "None",
    deadline: "N/A",
    explanation: "Normal operating parameters",
  },
  {
    machine: "Compressor_X",
    risk: 65,
    priority: "MEDIUM",
    action: "Schedule inspection",
    deadline: "Next 7 days",
    explanation: "Slight temperature anomaly detected",
  },
  {
    machine: "Conveyor_Belt_3",
    risk: 40,
    priority: "LOW",
    action: "Monitor",
    deadline: "N/A",
    explanation: "Acceptable wear on belt",
  },
  {
    machine: "Hydraulic_Press",
    risk: 95,
    priority: "CRITICAL",
    action: "Halt operations immediately",
    deadline: "Immediate",
    explanation: "Pressure drop indicating seal failure",
  }
];

export async function getMachinesStatus(): Promise<MachineData[]> {
  // Simulate network latency
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...MOCK_MACHINES]);
    }, 600);
  });
}

export async function uploadLogs(logData: string): Promise<MachineData> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const parsed = JSON.parse(logData);
        // Basic validation
        if (typeof parsed.machine !== "string" || typeof parsed.risk !== "number") {
          throw new Error("Invalid log format. Must include 'machine' and 'risk'.");
        }
        
        // Ensure format compliance
        const result: MachineData = {
          machine: parsed.machine,
          risk: parsed.risk,
          priority: parsed.priority || (parsed.risk >= 80 ? "CRITICAL" : parsed.risk >= 50 ? "MEDIUM" : "LOW"),
          action: parsed.action || "Please review logs",
          deadline: parsed.deadline || "TBD",
          explanation: parsed.explanation || "Analyzed from uploaded JSON log",
        };
        
        resolve(result);
      } catch (err) {
        reject(new Error("Invalid JSON format. Please upload valid machine data."));
      }
    }, 1200); // Simulate "Analyzing..."
  });
}
