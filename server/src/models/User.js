import mongoose from "mongoose";

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
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return candidatePassword === this.password;
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model("User", userSchema);

export default User;
