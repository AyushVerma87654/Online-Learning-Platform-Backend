import { verifyUser } from "../services/verifyUser.js";

export const verifyAccessToken = async (req, res, next) => {
  const data = await verifyUser(req.headers.authorization);
  if (!data.user) return res.status(401).json({ message: data.message });
  if (data.user) req.authUser = data.user;
  else res.json({ message: data.message });
  next();
};
