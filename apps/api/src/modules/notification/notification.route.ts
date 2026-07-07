import auth from "@/shared/middleware/auth";
import { Router } from "express";

import { NotificationController } from "./notification.controller";



const router = Router();


router.use(auth());


/**
 * GET /notifications
 * Get current user notifications
 */
router.get(
  "/",
  NotificationController.listNotifications
);


/**
 * PATCH /notifications/:id/read
 * Mark notification as read
 */
router.patch(
  "/:id/read",
  NotificationController.markRead
);

router.delete(
  "/:id",
  NotificationController.deleteNotification
);


export default router;