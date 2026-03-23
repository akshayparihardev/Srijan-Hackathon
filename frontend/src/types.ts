export interface MachineData {
  machine: string;
  risk: number;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  action: string;
  deadline: string;
  explanation: string;
}
