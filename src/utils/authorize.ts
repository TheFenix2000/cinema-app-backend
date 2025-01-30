import type { NextFunction, Request, Response } from "express";
import User from "../database/models/User";
import jwt from "./jwt";

function authorize(adminOnly: boolean) {
	return async function (req: Request, res: Response, next: NextFunction) {
		const { token } = req.cookies;
		if (res.locals.user) {
			if (adminOnly && !res.locals.user.admin) {
				res.sendStatus(403);
				return;
			} else {
				next();
				return;
			}
		}
		if (token) {
			const payload = jwt.verify(token);
			if (!payload) {
				res.sendStatus(401);
				return;
			}

			const user = await User.findById(payload.id);
			if (!user) {
				res.sendStatus(401);
				return;
			}
			res.locals.user = user;

			if (adminOnly && !user.admin) {
				res.sendStatus(403);
				return;
			} else {
				next();
				return;
			}
		} else res.sendStatus(401);
	};
}

export default authorize;
