import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

// Define schema
const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: {
      type: String,
      enum: ["patient", "therapist", "admin"],
      default: "patient",
    },
    language: { type: String, default: "English" },
    isVerified: { type: Boolean, default: false },
    license: { type: String, default: "" }, // For therapists
    specialization: { type: String, default: "" }, // For therapists
    avatar: { type: String, default: "" }, // Profile picture
  },
  { timestamps: true }
);

// 🔐 Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// 🔑 Compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = model("User", userSchema);
export default User;
