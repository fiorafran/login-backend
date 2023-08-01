import express from "express";
import mongoose from "mongoose";
import { config } from "dotenv";
import authRoutes from "./src/routes/authRoutes.routes.js";
import cors from "cors";

const app = express();

const corsOptions = {
  origin: ["http://localhost:4200"],
  methods: ["POST"],
};

// Settings
config();
app.set("port", process.env.PORT || 3000);
app.use(cors(corsOptions));

// Middlewares
app.use(express.json());

// Connect DB
const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Conexión exitosa a la base de datos");
  } catch (err) {
    console.error("Error al conectar a la base de datos: ", err);
  }
};
dbConnect();

// Routes
app.use("/api/auth", authRoutes);

// Starting server
app.listen(app.get("port"), () => {
  console.log(`server listening on port ${app.get("port")}`);
});
