import type { TUser } from "../database/models/User";

declare module "express-serve-static-core" {
	interface Locals {
		user: TUser;
	}
}
