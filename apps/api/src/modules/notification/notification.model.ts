import mongoose from "mongoose";

const notificationSchema =
  new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
        trim: true,
      },

      message: {
        type: String,
        required: true,
        trim: true,
      },

      read: {
        type: Boolean,
        default: false,
      },

      targetUser: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      incident: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Incident",
      },
    },
    {
      timestamps: true,
    },
  );

const Notification = mongoose.model(
  "Notification",
  notificationSchema,
);

export default Notification;