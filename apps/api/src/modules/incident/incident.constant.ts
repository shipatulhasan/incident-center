import { PopulateOptions } from "mongoose";

export const INCIDENT_POPULATE: PopulateOptions[] = [
  {
    path: "assignedTo",
    select: "name email role team isOnCall",
  },
  {
    path: "reportedBy",
    select: "name email role team isOnCall",
  },
  {
    path: "timeline.author",
    select: "name email",
  },
];

export const UPDATEABLE_FIELDS = [
  "title",
  "service",
  "description",
  "severity",
  "status",
  "assignedTo",
  "rootCause",
  "impact",
  "resolution",
] as const;