import mongoose, { Model, Schema } from "mongoose";

interface MovieDoc extends mongoose.Document {
	title: string;
	year: number;
	genre: string;
	director: string;
	actors: string;
	plot: string;
	poster: string;
}
type MovieModel = Model<MovieDoc>;

const movieSchema = new Schema<MovieDoc, MovieModel>({
	title: { type: String, required: true },
	year: { type: Number, required: true },
	genre: { type: String, required: true },
	director: { type: String, required: true },
	actors: { type: String, required: true },
	plot: { type: String, required: true },
	poster: { type: String, required: true },
});

const Movie = mongoose.model<MovieDoc, MovieModel>("Movie", movieSchema);

export default Movie;
export type { MovieDoc };

