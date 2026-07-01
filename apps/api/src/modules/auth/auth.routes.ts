import { Router } from "express";

import * as AuthController from "./auth.controller";

// import auth from "@/shared/middleware/auth";


const router = Router();

router.post(
  "/login",
  // validateRequest(loginSchema),
  AuthController.login,
);

router.get(
  "/me",
  // auth(),
  AuthController.me,
);

router.post(
  "/users",
  // auth("admin"),
  // validateRequest(createUserSchema),
  AuthController.createUser,
);

router.get(
  "/users",
  // auth("admin"),
  AuthController.listUsers,
);

router.delete(
  "/users/:id",
  // auth("admin"),
  AuthController.deleteUser,
);

export default router;