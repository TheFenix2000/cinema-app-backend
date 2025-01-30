import { Router, type Request } from "express";
import { testId } from "../database";
import Reservation from "../database/models/Reservation";
import type { ShowtimeIDParam } from "../types/requests";

const router = Router();

router.get("/:showtime", async (req: Request<ShowtimeIDParam>, res) => {
	if (!testId(req.params.showtime)) {
		res.sendStatus(404);
		return;
	}
	const reservations = await Reservation.find({ showtime: req.params.showtime });
	res.json(reservations.map((r) => r.seat));
});

export default router;
