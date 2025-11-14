import { verifyUser } from "../services/verifyUser.js";

export const isTheUserInstructor = async (req, res, next) => {
  const data = await verifyUser(req.headers.authorization);
  if (!data.user)
    return res.status(401).json({ message: data.message || "Unauthorized" });
  if (data.user.role !== "instructor")
    return res.status(403).json({ message: "User is not Instructor" });
  if (data.user) req.authUser = data.user;
  next();
};
