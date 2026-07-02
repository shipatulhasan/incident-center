// import { Types } from "mongoose";
type TIncidentSeverity =
  | "low"
  | "medium"
  | "high"
  | "critical";

type TIncidentStatus =
  | "open"
  | "investigating"
  | "resolved";

type TTimelineType =
  | "created"
  | "comment"
  | "status"
  | "assignment"
  | "severity"
  | "postmortem"
  | "system";

interface IActionItem {
  text: string;
  owner: string;
  dueDate?: Date;
  done: boolean;
}

interface ITimeline {
  type: TTimelineType;
  message: string;
  author?: string;
}


interface ICreateIncidentPayload {
  title: string;
  service: string;
  description: string;
  severity?: "low" | "medium" | "high" | "critical";
  assignedTo?:  string;
  impact?: string;
}

interface IUpdateIncidentPayload {
  title?: string;
  service?: string;
  description?: string;
  severity?: "low" | "medium" | "high" | "critical";
  status?: "open" | "investigating" | "resolved";
  assignedTo?: string;
  rootCause?: string;
  impact?: string;
  resolution?: string;
  actionItems?: unknown[];
}

interface IIncidentQuery {
  status?: string;
  severity?: string;
  q?: string;
}