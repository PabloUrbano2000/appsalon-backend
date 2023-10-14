import express from "express";
import {
  createAppointment,
  getAppointmentById,
  getAppointmentsByDate,
  updateAppointment,
  deleteAppointment,
} from "../controllers/appointmentsController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(authMiddleware, createAppointment)
  .get(authMiddleware, getAppointmentsByDate);

router
  .route("/:id")
  .get(authMiddleware, getAppointmentById)
  .put(authMiddleware, updateAppointment)
  .delete(authMiddleware, deleteAppointment);

export default router;
