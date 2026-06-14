import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  age?: number;
  gender?: "male" | "female" | "other";
  height?: number; // in cm
  weight?: number; // in kg
  activityLevel?: "sedentary" | "light" | "moderate" | "very" | "athlete" | "active";
  bmiCategory?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    age: {
      type: Number,
      min: 1,
      max: 120,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    height: {
      type: Number,
      min: 30,
      max: 300,
    },
    weight: {
      type: Number,
      min: 2,
      max: 600,
    },
    activityLevel: {
      type: String,
      enum: ["sedentary", "light", "moderate5", "moderate", "very", "athlete", "active"],
    },
    bmiCategory: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
