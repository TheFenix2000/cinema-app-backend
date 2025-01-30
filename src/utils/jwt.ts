import * as jwt from "jsonwebtoken";

const key = process.env["JWT_SECRET"] ?? "fenix";

function sign(data: object) {
	return jwt.sign(data, key);
}

function verify(token: string) {
	try {
		const payload = jwt.verify(token, key);
		if (typeof payload === "object") return payload;
		return null;
	} catch (err) {
		if (err instanceof Error && err.message === "invalid signature") return null;
		throw err;
	}
}

export default { sign, verify };
