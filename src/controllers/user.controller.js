import { asyncHandler } from "../utils/asyncHandler.js ";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { cloudinaryUpload } from "../utils/cloudinary.js";
import { ApiRes } from "../utils/ApiRes.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async(userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError("User not found", 404);
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    
    // Save refresh token to database
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
 
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError("Token generation failed", 500);
    
  }
  
  
}

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

    // Multer.fields provides req.files as an object with arrays for each field
    const avatarLocalPath = req.files?.avatar?.[0]?.path || null;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path || null;

    // Upload images to Cloudinary (both optional)
    let avatar = null;
    let coverImage = null;
    if (avatarLocalPath) {
      avatar = await cloudinaryUpload(avatarLocalPath);
      if (!avatar) {
        throw new ApiError("Avatar upload failed", 500);
      }
    }
    if (coverImageLocalPath) {
      const uploadedCover = await cloudinaryUpload(coverImageLocalPath);
      if (uploadedCover && uploadedCover.secure_url) {
        coverImage = uploadedCover.secure_url;
      }
    }

    // Create new user
  const user = await User.create({
    fullName,
    username:username.toLowerCase(),
    email,
    password,
    avatar: avatar?.secure_url || null,
    coverImage: coverImage || null,
  })

    const newUser = await User.findById(user.id).select('-password -refreshToken');

    
    if(!newUser){
        throw new ApiError("User registration failed", 500);
    }
    return res.status(201).json(
        new ApiRes(200,"User registered successfully", newUser)
    )
})

const loginUser = asyncHandler(async(req,res) =>{
  const {username, email, password} = req.body;

  if(!username && !email){
    throw new ApiError("Username or email are required", 400);
  }

  const user = await User.findOne({$or: [{username: username.toLowerCase()}, {email}]});

  if(!user){
    throw new ApiError("User not found", 404);
  }

  const isPasswordValid = await user.comparePassword(password);
  
  if(!isPasswordValid){
    throw new ApiError("Invalid password", 401);
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id).select('-password -refreshToken');

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  };
  return res.status(200).cookie('refreshToken', refreshToken, options).cookie('accessToken', accessToken, options).json(
    new ApiRes(200,"User logged in successfully", { user: loggedInUser, accessToken, refreshToken })
  );

})

const logoutUser = asyncHandler(async(req,res) =>{

  User.findByIdAndUpdate(req.user._id, { refreshToken: null }, { new: true }).exec();

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
    maxAge: 0 // Expire immediately
  };

  res.clearCookie('refreshToken', options);
  res.clearCookie('accessToken', options);

  return res.status(200).json(
    new ApiRes(200,null,"User logged out successfully")
  );

})

const refreshAccessToken = asyncHandler(async(req,res)=>{
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if(!incomingRefreshToken){
    throw new ApiError("Refresh token is required", 400);
  }

  try {
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
  
    const user = User.findById(decodedToken.id)
  
    if(!user || user.refreshToken !== incomingRefreshToken){
      throw new ApiError("Invalid refresh token", 401);
    }
  
    if(incomingRefreshToken !== user?.refreshToken){
      throw new ApiError("Refresh token mismatch", 401);
    }
    const options = {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    };
  
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
  
    return res.status(200).cookie('accessToken', accessToken, options).cookie('refreshToken', refreshToken, options).json(
      new ApiRes(200,{ accessToken, refreshToken} ,"Access token refreshed successfully")
    );
  } catch (error) {
    throw new ApiError(500,"Failed to refresh access token",);
  }
})

export { registerControllerUser, loginUser,logoutUser, refreshAccessToken };