import { Router, type Request } from "express";
import Reservation from "../database/models/Reservation";
import User, { type UserDoc } from "../database/models/User";
import type { AddInfoBody, IDParam, ReservationsSearchQuery } from "../types/requests";
import authorize from "../utils/authorize";
import findById from "../utils/findById";
import maps from "../utils/maps";

const router = Router();

router.use(authorize(false));
router.get("/me", (req, res) => {
	const response = maps.user(res.locals.user);
	res.json(response);
});
router.post("/me/add-info", async (req: Request<{}, {}, AddInfoBody>, res) => {
	const success = await addInfo(res.locals.user, req.body);
	res.status(success ? 200 : 400).json(maps.user(res.locals.user));
});
router.get("/me/reservations", async (req: Request<{}, {}, ReservationsSearchQuery>, res) => {
	const optionalFilters: { movieId?: string } = {};
	if (req.query.movie_id) optionalFilters.movieId = req.query.movie_id as string;
	res.json(await Reservation.find({ ...optionalFilters, user: res.locals.user }));
});

router.use(authorize(true));
router.get("/", async (req, res) => {
	res.json((await User.find()).map(maps.user));
});
router.get("/:id", async (req: Request<IDParam>, res) => {
	const user = await findById(User, req.params.id);
	if (!user) {
		res.sendStatus(404);
		return;
	}
	res.json(maps.user(user));
});
router.post("/:id/add-info", async (req: Request<IDParam, {}, AddInfoBody>, res) => {
	const user = await findById(User, req.params.id);
	if (!user) {
		res.sendStatus(404);
		return;
	}
	const success = await addInfo(user, req.body);
	res.status(success ? 200 : 400).json(maps.user(user));
});
router.get("/:id/reservations", async (req: Request<IDParam, {}, ReservationsSearchQuery>, res) => {
	const movieId = req.body.movie;

	const user = await findById(User, req.params.id);
	if (!user) {
		res.sendStatus(404);
		return;
	}
	res.json(await Reservation.find({ user, reservationDate: { $gte: req.query.date_start, $lte: req.query.date_end }, movieId }));
});

async function addInfo(user: UserDoc, data: AddInfoBody) {
	const { firstName, lastName, marketingConsent, phoneNumber } = data;
	if (!user.personalData) {
		if (!firstName || !lastName || !phoneNumber) return false;
		user.personalData = {
			firstName: firstName,
			lastName: lastName,
			marketingConsent: !!marketingConsent,
			phoneNumber: phoneNumber,
		};
	} else {
		if (firstName) user.personalData.firstName = firstName;
		if (lastName) user.personalData.lastName = lastName;
		if (marketingConsent !== undefined) user.personalData.marketingConsent = marketingConsent;
		if (phoneNumber) user.personalData.phoneNumber = phoneNumber;
	}

	await user.save();
	return true;
}

export default router;
