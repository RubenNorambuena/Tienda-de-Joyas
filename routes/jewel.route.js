import { Router } from "express";
import { jewelController } from "../controllers/jewel.controller.js";
import { reportQuery, reportParams } from "../middlewares/middlewares.js";

const router = Router();

router.get("/", (req, res) => {
    res.json({ ok: true, result: "All ok in the root path" });
});
router.get("/joyas", reportQuery, jewelController.getAllJewels);
router.get("/joyas/filtros", reportQuery, jewelController.filterJewel);
router.get("/joyas/:id", reportParams, jewelController.getJewelById);
router.get("*", (req, res) => {
    res.status(404).json({ ok: false, result: "The route does not exist" });
});

export default router;