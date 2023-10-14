import express from "express";
import { db } from "./config/db.js";
import colors from "colors";
import cors from "cors";
import servicesRoutes from "./routes/servicesRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import appointmentsRoutes from "./routes/appointmentsRoutes.js";
import userRoutes from "./routes/userRoutes.js";

import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

db();

const whitelist = [process.env.FRONTEND_URL];

if (process.argv[2] === "--postman") {
  whitelist.push(undefined);
}

const corsOptions = {
  origin: function (origin, cb) {
    console.log(origin);
    if (whitelist.includes(origin)) {
      // Permite la conexión
      cb(null, true);
    } else {
      // no permite la conexión
      cb(new Error("Error de CORS"));
    }
  },
};
app.use(cors(corsOptions));

app.use("/api/services", servicesRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentsRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(
    colors.blue("El servidor se está ejecutando en el puerto"),
    colors.blue.bold(PORT)
  );
});
