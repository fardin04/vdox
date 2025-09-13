import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true,},
    fullName: { type: String, required: true, trim: true,index: true },
    password: { type: String, required: true },
  avatar: { type: String, default: null },
  coverImage: { type: String, default: null },
    watchHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
    refreshToken: { type: String },

}, { timestamps: true });

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

// Method to compare password
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// generate access token

userSchema.methods.generateAccessToken = function() {
  return jwt.sign({
    id: this._id,
    username: this.username,
    email: this.email
  }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION });
}

// generate refresh token
userSchema.methods.generateRefreshToken = function() {
  return jwt.sign({
    id: this._id,
    username: this.username,
    email: this.email
  }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION });
}

export const User = mongoose.model("User", userSchema);