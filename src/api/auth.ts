import { Router, type Request } from "express";
import User from "../database/models/User";
import type { RegisterBody, SigninBody } from "../types/requests";
import authorize from "../utils/authorize";
import jwt from "../utils/jwt";

const router = Router();

router.post("/signin", async (req: Request<{}, {}, SigninBody>, res) => {
	const { login, password } = req.body;
	if (!login || !password) {
		res.sendStatus(400);
	}

	const user = await User.findOne({ login });
	if (!user) {
		res.sendStatus(404);
		return;
	}

	if (!(await user.testPassword(password))) {
		res.sendStatus(404);
		return;
	}

	res.cookie("token", jwt.sign({ id: user._id }), { httpOnly: true, secure: false, sameSite: "lax", path: "/" });
	res.sendStatus(200);
});
router.post("/register", async (req: Request<{}, {}, RegisterBody>, res) => {
	const { login, password1, password2 } = req.body;
	if (!login || !password1 || !password2 || password1 !== password2) {
		res.sendStatus(400);
		return;
	}

	const found = await User.findOne({ login });
	if (found) {
		res.sendStatus(400);
		return;
	}

	const user = new User({ login, password: password1 });
	await user.save();
	res.sendStatus(201);
});
router.get("/signout", authorize(false), (req, res) => {
	res.clearCookie("token");
	res.sendStatus(200);
});

export default router;
