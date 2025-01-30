import type { ReservationDoc } from "../database/models/Reservation";
import Reservation from "../database/models/Reservation";
import type { UserDoc } from "../database/models/User";

function user(user: UserDoc) {
	return {
		login: user.login,
		admin: user.admin,
		personalData: user.personalData,
	};
}

async function reservation(reservation: ReservationDoc) {
	return (
		await Reservation.findById(reservation)
			.populate([{ path: "showtime", select: "-_id -__v", populate: { path: "movie", select: "-_id" } }])
			.select("-_id showtime reservationDate seat")
	)?.toJSON();
}

export default {
	user,
	reservation,
};
