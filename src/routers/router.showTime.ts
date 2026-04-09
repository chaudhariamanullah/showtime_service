import { Router } from "express";
import showTimeController from "../controllers/controller.showTime.js";
const router = Router();

router.get("/",showTimeController.filterShow); //Query Params Passes For Filtering
router.post("/",showTimeController.add);  //Add
router.post("/:movie_public_id",showTimeController.findByMovieAndTheaterDate);
router.put("/:showtime_public_id",showTimeController.edit)  //update any detail
router.delete("/:showtime_public_id",showTimeController.remove)
router.post("/:showTime_public_id/housefull",showTimeController.housefull);
router.post("/:showTime_public_id/cancel",showTimeController.cancel);
router.get("/:showtime_public_id/availability",showTimeController.available); //check all available showtimes
router.get("/:showtime_public_id",showTimeController.getShowtime); //get a specific show-time detail
router.post("/validate-slot",showTimeController.validate); //Validate slot befor adding
router.get("/screen/:scree_public_id",showTimeController.getShowTimeAtScreen); //check all showtimes on a particular date on particular screen

export default router;