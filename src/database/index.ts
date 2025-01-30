import mongoose from "mongoose";

const host = process.env["DB_HOST"] || "172.17.0.3";
const port = process.env["DB_PORT"] || 27017;
const database = process.env["DB_DATABASE"] || "cinema";
const user = process.env["DB_USER"] || "cinema";
const password = process.env["DB_PASSWORD"] || "cinema";

async function connect() {
	try {
		await mongoose.connect(`mongodb://${host}:${port}/`, {
			maxPoolSize: 10,
			user: user,
			pass: password,
			dbName: database,
			// authSource: database do builda
		});
		if (testConnection()) {
			console.log("Connected to database");
			return true;
		} else throw new Error("Database connection refused");
	} catch (err) {
		if (err instanceof Error) console.log(`Failed connecting to database: ${err.message}`);
		else console.log("Failed connecting to database");
		return false;
	}
}

async function disconnect() {
	if (testConnection()) {
		await mongoose.disconnect();
		console.log("Disconnected from database");
	}
}

function testConnection() {
	return mongoose.connection.readyState === mongoose.STATES.connected;
}

function testId(id: string) {
	return /^[0-9a-f]{24}$/.test(id);
}

export { connect, disconnect, testConnection, testId };

