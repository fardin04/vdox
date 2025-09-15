import { asyncHandler } from "../utils/asyncHandler.js ";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError("Access denied. No token provided.");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken?.id).select(
            "-password -__v -createdAt -updatedAt -refreshToken"
        );

        if (!user) {
            throw new ApiError("User not found", 404);
        }

        req.user = user; // Attach user to request object
        next();
    } catch (error) {
        throw new ApiError("Invalid or expired token" || error?.message, 401);
    }
});
