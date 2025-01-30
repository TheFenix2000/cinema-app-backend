import { Router, type Request } from "express";
import Showtime from "../database/models/Showtime";
import type { IDParam, ShowtimeCreateBody, ShowtimesSearchQuery } from "../types/requests";
import authorize from "../utils/authorize";
import findById from "../utils/findById";

const router = Router();
router.use(authorize(false));
router.get("/", async (req: Request<{}, {}, ShowtimesSearchQuery>, res) => {
	const { format, title, date } = req.query;
	const optionalFilters: { format?: "2D" | "3D" | "VIP"; date?: string } = {};
	if (format && date) {
		optionalFilters.format = format as "2D" | "3D" | "VIP";
		optionalFilters.date = date as string;
	}

	const movies = await Showtime.find({ ...optionalFilters })
		.populate([{ path: "movie", select: "-_id -__v" }])
		.select("format date movie")
		.lean(true);

	if (title) {
		const filteredMovies = movies.filter((movie) => {
			if (typeof movie.movie !== "object" || !("title" in movie.movie)) {
				return false;
			}
			return movie.movie.title === title;
		});
		res.json(filteredMovies);
		return;
	}
	res.json(movies);
});

router.get("/:id", async (req: Request<IDParam>, res) => {
	const movie = await findById(Showtime, req.params.id);
	if (!movie) {
		res.sendStatus(404);
		return;
	}
	res.json(movie.toJSON());
});

router.use(authorize(true));
router.post("/", async (req: Request<{}, {}, ShowtimeCreateBody[]>, res) => {
	const results: any[] = [];
	for (const { movie, date, format } of req.body) {
		if (await Showtime.findOne({ movie, date })) {
			res.sendStatus(400);
			return;
		}
		const showtime = new Showtime({ movie, date, format });
		await showtime.save();
		results.push(showtime.toJSON());
	}
	res.json(results);
});

export default router;
