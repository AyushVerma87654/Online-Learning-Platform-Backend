import { UserModel } from "../models/userModel.js";
import { supabase } from "./supabase.js";

export const verifyUser = async (authHeader) => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { message: "No token provided" };
  }

  const token = authHeader.split(" ")[1];

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);
  //   console.log("authUser", user);

  if (user) {
    const authUser = await UserModel.getUserById(user.id);
    // console.log("user", authUser.data);
    return { user: authUser.data };
  } else return { message: error };
};
