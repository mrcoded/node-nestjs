import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
  name: string;
  age: number;
  email: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: String,
  age: Number,
  email: String,
  createdAt: Date,
});

const User = mongoose.model<IUser>("User", UserSchema);

export { User, IUser };
