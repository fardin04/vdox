import { asyncHandler } from "../utils/asyncHandler.js ";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { cloudinaryUpload } from "../utils/cloudinary.js";
import { ApiRes } from "../utils/ApiRes.js";

const registerControllerUser = asyncHandler(async(req,res) =>{
  const { fullName, username, email, password } = req.body;
  console.log("fullName:",fullName);

    // Validate input

  if(!fullName || !username || !email || !password){
    throw new ApiError("All fields are required", 400);
  }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existingUser) {
        throw new ApiError("User with this email or username already exists", 409);
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    if(!avatarLocalPath){
      throw new ApiError("Avatar image is required", 400);
    }

    // Upload images to Cloudinary
  const avatar = await cloudinaryUpload(avatarLocalPath);
  let coverImage = await cloudinaryUpload(coverImageLocalPath);

  if(!avatar){
    throw new ApiError("Avatar upload failed", 500);
  }

  if(!coverImage){
    throw new ApiError("Cover image upload failed", 500);
  }

    // Create new user
    const user = await User.create({
        fullName,
        username:username.toLowerCase(),
        email,
        password,
        avatar: avatar.secure_url,
        coverImage: coverImage?.secure_url || null,
    })

    const newUser = await User.findById(user.id).select('-password -refreshToken');

    
    if(!newUser){
        throw new ApiError("User registration failed", 500);
    }
    return res.status(201).json(
        new ApiRes(200,"User registered successfully", newUser)
    )
})

export { registerControllerUser };