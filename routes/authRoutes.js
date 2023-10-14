import express from "express";
import {
  register,
  verifyAccount,
  login,
  forgotPassword,
  user,
  verifyPasswordResetToken,
  updatePassword,
  admin,
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.get("/verify/:token", verifyAccount);
router.post("/login", login);
router.get("/forgot-password", forgotPassword);
router
  .route("/forgot-password/:token")
  .get(verifyPasswordResetToken)
  .post(updatePassword);

// Area privada
router.get("/user", authMiddleware, user);
router.get("/admin", authMiddleware, admin);

export default router;
