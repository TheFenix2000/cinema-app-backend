import mongoose, { Model, Schema } from "mongoose";
import type { MovieDoc } from "./Movie";
import Movie from "./Movie";

interface ShowtimeDoc extends mongoose.Document {
	movie: Schema.Types.ObjectId | MovieDoc;
	date: Date;
	format: "2D" | "3D" | "VIP";
}
type ShowtimeModel = Model<ShowtimeDoc>;

const showtimeSchema = new Schema<ShowtimeDoc, ShowtimeModel>({
	movie: { type: Schema.Types.ObjectId, ref: "Movie", reqired: true },
	date: { type: Date, required: true },
	format: {
		type: String,
		enum: ["2D", "3D", "VIP"],
		default: "2D",
	},
});

showtimeSchema.pre("save", async function (next) {
	if (this.isNew || this.isModified("movie")) {
		const movie = await Movie.findById(this.movie);
		if (!movie) throw new Error("Movie not found");
	}
	next();
});

const Showtime = mongoose.model<ShowtimeDoc, ShowtimeModel>("Showtime", showtimeSchema);

export default Showtime;
export type { ShowtimeDoc };

