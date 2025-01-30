import mongoose, { Model, Schema } from "mongoose";
import type { ShowtimeDoc } from "./Showtime";
import Showtime from "./Showtime";
import type { UserDoc } from "./User";
import User from "./User";

interface ReservationDoc extends mongoose.Document {
	showtime: mongoose.Types.ObjectId | ShowtimeDoc;
	user: Schema.Types.ObjectId | UserDoc;
	seat: string;
	reservationDate: Date;
}
type ReservationModel = Model<ReservationDoc>;

const reservationSchema = new Schema<ReservationDoc, ReservationModel>({
	showtime: { type: Schema.Types.ObjectId, ref: "Showtime", required: true },
	user: { type: Schema.Types.ObjectId, ref: "User", required: true },
	seat: { type: String, required: true },
	reservationDate: { type: Date, immutable: true },
});
reservationSchema.pre("save", async function (next) {
	if (this.isNew || this.isModified("user")) {
		const user = await User.findById(this.user);
		if (!user) throw new Error("User not found");
	}
	if (this.isNew || this.isModified("showtime")) {
		const showtime = await Showtime.findById(this.showtime);
		if (!showtime) throw new Error("Showtime not found");
	}
	if (this.isNew || this.isModified("seat")) {
		if (await Reservation.findOne({ showtime: this.showtime, seat: this.seat })) throw new Error("Seat already taken");
	}
	if (this.isNew) this.reservationDate = new Date();
	next();
});

const Reservation = mongoose.model<ReservationDoc, ReservationModel>("Reservation", reservationSchema);

export default Reservation;
export type { ReservationDoc };

