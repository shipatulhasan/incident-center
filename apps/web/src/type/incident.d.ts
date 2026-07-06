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
  _id: string;
  text: string;
  owner: string;
  dueDate?: Date;
  done: boolean;
}

interface ITimeline {
  _id: string
  type: TTimelineType;
  message: string;
  author?: Pick<IUser,'name','email'>;
  createdAt?:date
}
interface IAssignTo {
  select: "name email role team isOnCall",
  name: TTimelineType;
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

interface TIncident {
  _id: string;
  title: string;
  service: string;
  description: string;
  severity?: "low" | "medium" | "high" | "critical";
  status?: string;
  mttrMinutes?: number;
  assignedTo?: TIUser;
  timeline?:ITimeline[];
  impact?: string;
  rootCause?: string;
  resolution?: string;
  actionItems?: IActionItem[];
}