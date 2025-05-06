import express from "express";

import {
  deleteUser,
  getAllUser,
  getUser,
  updateUser,
} from "../controllers/User.controller.js";
import upload from "../config/multer.js";
import { authenticate } from "../middleware/authenticate.js";

const UserRoute = express.Router();

UserRoute.get("/get-user/:userid", authenticate, getUser);
UserRoute.put(
  "/update-user/:userid",
  authenticate,
  upload.single("file"),
  updateUser
);
UserRoute.get("/get-all-user", authenticate, getAllUser);
UserRoute.delete("/delete/:id", authenticate, deleteUser);

export default UserRoute;
