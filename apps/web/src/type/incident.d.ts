interface TIncident {
  title: string;
  service: string;
  description: string;
  severity?: "low" | "medium" | "high" | "critical";
  assignedTo?:  string;
  impact?: string;
}