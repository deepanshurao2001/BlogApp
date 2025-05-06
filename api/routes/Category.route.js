import express from "express";
import {
  addCategory,
  deleteCategory,
  getAllCategory,
  showCategory,
  updateCategory,
} from "../controllers/Category.controller.js";
import { onlyadmin } from "../middleware/onlyadmin.js";

const CategoryRoutes = express.Router();

CategoryRoutes.post("/add", onlyadmin, addCategory);
CategoryRoutes.put("/update/:categoryid", onlyadmin, updateCategory);
CategoryRoutes.get("/show/:categoryid", onlyadmin, showCategory);
CategoryRoutes.delete("/delete/:categoryid", onlyadmin, deleteCategory);
CategoryRoutes.get("/all-category", getAllCategory);

export default CategoryRoutes;
