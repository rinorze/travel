import bcrypt from "bcrypt";
import mongoose from "mongoose";

const BCRYPT_ROUNDS = 12;

const ADMIN_EMAIL = "rzeqiri03@gmail.com";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 60,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function () {
  // Auto-assign admin role for the admin email
  if (this.isModified("email") && this.email === ADMIN_EMAIL) {
    this.role = "admin";
  }
  // Store only a bcrypt hash, never the password itself.
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, BCRYPT_ROUNDS);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model("User", userSchema);

export default User;
