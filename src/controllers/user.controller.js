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

    // Find avatar and coverImage files from req.files array (for upload.any())
    let avatarFile = null;
    let coverImageFile = null;
    if (Array.isArray(req.files)) {
      avatarFile = req.files.find(f => f.fieldname === "avatar");
      coverImageFile = req.files.find(f => f.fieldname === "coverImage");
    }
    const avatarLocalPath = avatarFile?.path;
    let coverImageLocalPath = coverImageFile?.path || "";

    if(!avatarLocalPath){
      throw new ApiError("Avatar image is required", 400);
    }

    // Upload images to Cloudinary
  const avatar = await cloudinaryUpload(avatarLocalPath);
    let coverImage = "";
    if (coverImageLocalPath) {
      const uploadedCover = await cloudinaryUpload(coverImageLocalPath);
      if (uploadedCover && uploadedCover.secure_url) {
        coverImage = uploadedCover.secure_url;
      }
    }

  if(!avatar){
    throw new ApiError("Avatar upload failed", 500);
  }

  // No error thrown if coverImage is not uploaded; just set to empty string

    // Create new user
    const user = await User.create({
        fullName,
        username:username.toLowerCase(),
        email,
        password,
        avatar: avatar.secure_url,
          coverImage,
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