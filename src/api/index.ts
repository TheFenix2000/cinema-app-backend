import { Router } from "express";
import auth from "./auth";
import movies from "./movies";
import reservations from "./reservations";
import seats from "./seats";
import showtimes from "./showtimes";
import user from "./users";

const router = Router();

router.use("/auth", auth);
router.use("/users", user);
router.use("/movies", movies);
router.use("/showtimes", showtimes);
router.use("/reservations", reservations);
router.use("/seats", seats);

export default router;
