import { type InferSchemaType, Schema, model } from "mongoose";

import { cleanResponse } from "../db/mongoose.plugins.ts";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "firstName is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "firstName is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Email is not valid"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
      minlength: [12, "Password must be at least 6 characters long"],
    },
    roles: {
      type: [String],
      default: ["user"],
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

userSchema.plugin(cleanResponse);

export type UserDoc = InferSchemaType<typeof userSchema>;
const User = model<UserDoc>("User", userSchema);

export default User;
