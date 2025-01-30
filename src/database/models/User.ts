import mongoose, { Model, Schema } from "mongoose";

type PersonalData = {
	firstName: string;
	lastName: string;
	phoneNumber?: string;
	marketingConsent: boolean;
};
type UserDoc = mongoose.Document & {
	login: string;
	password: string;
	admin: boolean;
	personalData?: PersonalData;
};
type UserMethods = {
	testPassword: (password: string) => Promise<boolean>;
};
type UserModel = Model<UserDoc, {}, UserMethods>;

const personalSchema = new Schema<PersonalData>(
	{
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		phoneNumber: { type: String, required: false },
		marketingConsent: { type: Boolean, required: true },
	},
	{ _id: false },
);
const userSchema = new Schema<UserDoc, UserModel>({
	login: { type: String, required: true },
	password: { type: String, required: true },
	admin: { type: Boolean, default: false },
	personalData: personalSchema,
});
userSchema.pre("save", async function (next) {
	if (this.isNew || this.isModified("password")) this.password = await Bun.password.hash(this.password, "argon2id");
	next();
});
userSchema.method("testPassword", async function (password: string) {
	return await Bun.password.verify(password, this.password, "argon2id");
});

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export default User;
export type { UserDoc };

