import type { Request, Response } from "express";

import catchAsync from "@/shared/middleware/catchAsync";


import * as AuthService from "./auth.service";
import sendResponse from "@/shared/types/sendResponse";

export const login = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.login(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Login successful",
    data: result,
  });
});

export const me = catchAsync(async (req: Request, res: Response) => {
  
  const result = await AuthService.me(req.user);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Profile retrieved successfully",
    data: result,
  });
});

export const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.createUser(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "User created successfully",
    data: result,
  });
});

export const listUsers = catchAsync(async (_req: Request, res: Response) => {
  const result = await AuthService.listUsers();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Users retrieved successfully",
    data: result,
  });
});

export const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.deleteUser(
    req.params.id as string
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: result.message,
  });
});