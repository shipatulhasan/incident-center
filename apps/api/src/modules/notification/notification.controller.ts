import { Request, Response } from "express";
import httpStatus from "http-status-codes";

import { NotificationService } from "./notification.service";



const listNotifications = async (
  req: Request,
  res: Response,
) => {

  const notifications =
    await NotificationService.getMyNotifications(
      req.user._id as any
    );


  res.status(httpStatus.OK).json({
    success: true,
    message: "Notifications retrieved successfully",
    data: {
      notifications,
    },
  });

};





const markRead = async (
  req: Request,
  res: Response,
) => {

  const notification =
    await NotificationService.markAsRead(
      req.params.id as string,
      req.user._id as any
    );


  res.status(httpStatus.OK).json({
    success: true,
    message: "Notification marked as read",
    data: {
      notification,
    },
  });

};






const markAllRead = async (
  req: Request,
  res: Response,
) => {

  await NotificationService.markAllAsRead(
    req.user._id as any
  );


  res.status(httpStatus.OK).json({
    success: true,
    message: "All notifications marked as read",
    data: null,
  });

};






const deleteNotification = async (
  req: Request,
  res: Response,
) => {

  await NotificationService.remove(
    req.params.id as string,
    req.user._id as any
  );


  res.status(httpStatus.OK).json({
    success: true,
    message: "Notification removed",
    data: null,
  });

};





export const NotificationController = {
  listNotifications,
  markRead,
  markAllRead,
  deleteNotification,
};