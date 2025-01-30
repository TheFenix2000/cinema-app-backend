import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";
import api from "./api";
import { connect } from "./database";

const HOST = process.env["HOST"] ?? "0.0.0.0";
const PORT = +(process.env["PORT"] ?? "3000");

const app = express();

app.use(
	cors({
		origin: "http://localhost:4200",
		credentials: true,
	}),
);
app.use(cookieParser(process.env["JWT_SECRET"] ?? "fenix"));
app.use(express.json());
app.use("/api/v1", api);
app.use((req, res) => {
	res.sendStatus(404);
});
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
	if (err) console.error(err);
	if (!res.headersSent) res.sendStatus(500);
});

if (await connect()) {
	app.listen(PORT, HOST, () => {
		console.log("Server started");
	});
} else {
	console.error("No database connection");
}
