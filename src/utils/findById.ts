import type mongoose from "mongoose";
import { testId } from "../database";

async function findById<T>(model: mongoose.Model<T>, id: string): Promise<T | null> {
	if (!testId(id)) return null;
	const data = await model.findById(id);
	return data;
}

export default findById;
