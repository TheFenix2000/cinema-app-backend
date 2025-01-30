import { Router, type Request } from "express";
import mongoose from "mongoose";
import { testId } from "../database";
import Reservation from "../database/models/Reservation";
import type { ReservationCreateBody, ReservationsSearchQuery, UserIDParam } from "../types/requests";
import authorize from "../utils/authorize";
import maps from "../utils/maps";

const router = Router();
router.use(authorize(false));
router.post("/", async (req: Request<{}, {}, ReservationCreateBody>, res) => {
	const { showtime, seatNumber } = req.body;
	const { user } = res.locals;
	if (!testId(showtime) || !seatNumber) {
		res.sendStatus(400);
		return;
	}

	const reservation = new Reservation();
	reservation.user = user;
	reservation.showtime = new mongoose.Types.ObjectId(showtime);
	reservation.seat = seatNumber;

	try {
		await reservation.save();
		res.status(201).json(await maps.reservation(reservation));
	} catch (err: unknown) {
		const { message } = err as Error;
		if (["Seat already taken", "Showtime not found", "User not found"].includes(message)) res.sendStatus(400);
		else {
			res.sendStatus(500);
			console.error(err);
		}
	}
});

router.use(authorize(true));
router.get("/", async (req: Request<{}, {}, {}, ReservationsSearchQuery>, res) => {
	if (!req.query.dateStart || !req.query.dateEnd) {
		res.sendStatus(400);
		return;
	}

	const reservations = await Reservation.find({});
	const response = await Promise.all(reservations.map(maps.reservation));
	res.json(response);
});

router.post("/:user", async (req: Request<UserIDParam, {}, ReservationCreateBody>, res) => {
	const { showtime, seatNumber } = req.body;
	const { user } = req.params;
	if (!testId(user) || !testId(showtime) || !seatNumber) {
		res.sendStatus(400);
		return;
	}

	const reservation = new Reservation();
	reservation.user = new mongoose.Schema.Types.ObjectId(user);
	reservation.showtime = new mongoose.Types.ObjectId(showtime);
	reservation.seat = seatNumber;

	try {
		await reservation.save();
		res.status(201).json(await maps.reservation(reservation));
	} catch (err: unknown) {
		const { message } = err as Error;
		if (["Seat already taken", "Showtime not found", "User not found"].includes(message)) res.sendStatus(400);
		else {
			res.sendStatus(500);
			console.error(err);
		}
	}
});

export default router;
