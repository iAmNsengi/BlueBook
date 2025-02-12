import { retryMiddleware } from "../middlewares/retry.middleware";
import User from "../models/user.model";
import catchAsync from "../utils/catchAsync";



export const addUserInterests = retryMiddleware(
  catchAsync(async (req, res, next) => {
    const interests = req.body.interests;
    const user = await User.model.findById(req.user?._id);
    for (const interest of interests) {
      user.interests.push(interest);
    }
    await user.save();
  })
);

// export const updateUserInterests = retryMiddleware(catchAsync(async (req, res, next) => {
//     const
// }))
