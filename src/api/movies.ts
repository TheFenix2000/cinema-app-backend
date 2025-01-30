import { Router, type Request } from "express";
import Movie from "../database/models/Movie";
import type { IDParam, MovieCreateBody } from "../types/requests";
import authorize from "../utils/authorize";
import findById from "../utils/findById";

const router = Router();

router.get("/", async (req, res) => {
	res.json(await Movie.find().lean(true));
});

router.get("/:id", async (req: Request<IDParam>, res) => {
	const movie = await findById(Movie, req.params.id);
	if (!movie) {
		res.sendStatus(404);
		return;
	}
	res.json(movie.toJSON());
});

router.use(authorize(true));

router.post("/", async (req: Request<{}, {}, MovieCreateBody>, res) => {
	const { title, year, genre, director, actors, plot, poster } = req.body;
	if (await Movie.findOne({ title })) {
		res.sendStatus(400);
		return;
	}

	const movie = new Movie({ title, year, genre, director, actors, plot, poster });
	await movie.save();
	res.json(movie.toJSON());
});

export default router;
