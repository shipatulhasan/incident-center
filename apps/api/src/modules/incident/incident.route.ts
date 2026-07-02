import { Router } from "express";

import { IncidentController } from "./incident.controller";
import auth from "@/shared/middleware/auth";



const router = Router();

router.use(auth());

router.get(
  "/stats",
  IncidentController.getStats,
);

router
  .route("/")
  .get(IncidentController.getIncidents)
  .post(IncidentController.createIncident);

router
  .route("/:id")
  .get(IncidentController.getIncident)
  .patch(IncidentController.updateIncident)
  .delete(
    auth("admin"),
    IncidentController.deleteIncident,
  );

router.post(
  "/:id/comments",
  IncidentController.addComment,
);

export default router;