import { Router } from "express";
import { addInstitution } from "../controllers/institution.controller.js";

const router = Router();

router.route("/add").post(addInstitution);

export default router;
