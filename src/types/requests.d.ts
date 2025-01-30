// id param
export interface IDParam {
	id: string;
}

// auth
export interface RegisterBody {
	login: string;
	password1: string;
	password2: string;
}

export interface AddInfoBody {
	firstName?: string;
	lastName?: string;
	phoneNumber?: string;
	marketingConsent?: boolean;
}

export interface SigninBody {
	login: string;
	password: string;
}

// reservations
export interface ReservationsSearchQuery {
	dateStart: string;
	dateEnd: string;
	movie?: string;
	user?: string;
}

export interface ReservationCreateBody {
	showtime: string;
	seatNumber: string;
}

export interface UserIDParam {
	user: string;
}

// showtimes
export interface ShowtimesSearchQuery {
	title?: string;
	format?: "2D" | "3D" | "VIP";
	date?: string;
}

export interface ShowtimeIDParam {
	showtime: string;
}

export interface ShowtimeCreateBody {
	movie: string;
	date: string;
	format: "2D" | "3D" | "VIP";
}

// movies
export interface MovieCreateBody {
	title: string;
	year: number;
	genre: string;
	director: string;
	actors: string;
	plot: string;
	poster: string;
}
