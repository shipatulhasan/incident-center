import type { Request, Response } from "express";
import catchAsync from "@/shared/middleware/catchAsync";
import sendResponse from "@/shared/types/sendResponse";
import { IncidentService } from "./incident.service";

const createIncident = catchAsync(async (req:Request, res:Response) => {
  const result = await IncidentService.createIncident(
    req.body,
    req.user.id
  );

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Incident created successfully.",
    data: result,
  });
});

const getIncidents = catchAsync(async (req:Request, res:Response) => {
  const result = await IncidentService.getIncidents(
    req.query
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Incidents fetched successfully.",
    data: result,
  });
});

const getIncident = catchAsync(async (req:Request, res:Response) => {
  const result = await IncidentService.getIncident(
    req.params.id as string
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Incident fetched successfully.",
    data: result,
  });
});

const updateIncident = catchAsync(async (req:Request, res:Response) => {
  const result = await IncidentService.updateIncident(
    req.params.id as string,
    req.body,
    req.user.id
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Incident updated successfully.",
    data: result,
  });
});

const addComment = catchAsync(async (req:Request, res:Response) => {
  const result = await IncidentService.addComment(
    req.params.id as string,
    req.body.message,
    req.user
  );

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Comment added successfully.",
    data: result,
  });
});

const deleteIncident = catchAsync(async (req:Request, res:Response) => {
  await IncidentService.deleteIncident(
    req.params.id as string
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Incident deleted successfully.",
    data: null,
  });
});

const getStats = catchAsync(async (req:Request, res:Response) => {
  const result = await IncidentService.getStats();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Incident statistics fetched successfully.",
    data: result,
  });
});

export const IncidentController = {
  createIncident,
  getIncidents,
  getIncident,
  updateIncident,
  addComment,
  deleteIncident,
  getStats,
};