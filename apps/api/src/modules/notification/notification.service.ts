import { Types } from 'mongoose';
import Notification from "./notification.model";
interface ICreateNotificationPayload {
  title: string;
  message: string;
  incident?: Types.ObjectId | string;
  targetUser?:Types.ObjectId | string

}
const create = async (
  payload: ICreateNotificationPayload
) => {
  return await Notification.create(payload);
};

const getMyNotifications = async (
  userId: string,
) => {
  return await Notification.find({
    targetUser: userId,
  })
    .sort({
      createdAt: -1,
    })
    .populate(
      "incident",
      "title severity status",
    );
};

const markAsRead = async (
  notificationId: string,
  userId: string,
) => {
  return await Notification.findOneAndUpdate(
    {
      _id: notificationId,
      targetUser: userId,
    },
    {
      read: true,
    },
    {
      new: true,
    },
  );
};

const markAllAsRead = async (
  userId: string,
) => {
  await Notification.updateMany(
    {
      targetUser: userId,
      read: false,
    },
    {
      read: true,
    },
  );

  return null;
};

const remove = async (
  notificationId: Types.ObjectId | string,
  userId: string,
) => {
  return await Notification.findOneAndDelete({
    _id: notificationId,
    targetUser: userId,
  });
};

export const NotificationService = {
  create,
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  remove,
};