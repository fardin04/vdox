import { asyncHandler } from "../utils/asyncHandler.js ";

const registerControllerUser = asyncHandler(async(req,res) =>{
    res.status(200).json({
        message:"User register controller"
    })
})

export { registerControllerUser };