import { Router } from "express";
import multer from "multer";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { createStatus, getAllStatuses } from "../controllers/StatusController.js";

const statusRoutes = Router();

const upload = multer({ dest: "uploads/files" });


statusRoutes.post("/set-status", verifyToken, upload.single("image"), createStatus);

statusRoutes.get("/get-statuses", verifyToken, getAllStatuses);

export default statusRoutes;
